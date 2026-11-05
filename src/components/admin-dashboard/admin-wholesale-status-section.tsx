"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Megaphone,
  Image as ImageIcon,
  Type,
  Calendar,
  Clock,
  Eye,
  Trash2,
  Power,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { uploadProductImage } from "@/lib/api/products";
import { WholesaleStatusDialog, type WholesaleStatusItem } from "@/components/wholesale/wholesale-status-dialog";

export function AdminWholesaleStatusSection() {
  const queryClient = useQueryClient();

  const [statusType, setStatusType] = useState<"text" | "image">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [durationPreset, setDurationPreset] = useState("24h");
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState(() => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new Date(future.getTime() - future.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [previewItem, setPreviewItem] = useState<WholesaleStatusItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-wholesale-statuses"],
    queryFn: async () => {
      const res = await fetch("/api/wholesale-status?all=true");
      if (!res.ok) throw new Error("Failed to fetch statuses");
      const json = await res.json();
      return (json.statuses || []) as WholesaleStatusItem[];
    },
  });

  const statuses = data || [];

  const handlePresetChange = (preset: string) => {
    setDurationPreset(preset);
    const start = new Date(startTime).getTime();
    let hours = 24;
    if (preset === "12h") hours = 12;
    if (preset === "24h") hours = 24;
    if (preset === "48h") hours = 48;
    if (preset === "7d") hours = 168;

    if (preset !== "custom") {
      const end = new Date(start + hours * 60 * 60 * 1000);
      setEndTime(new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a status heading");
      return;
    }

    if (statusType === "image" && !imageFile && !imagePreview) {
      toast.error("Please select an image flyer to upload");
      return;
    }

    if (statusType === "text" && !content.trim()) {
      toast.error("Please write the announcement text");
      return;
    }

    try {
      setIsSubmitting(true);

      let finalImageUrl = imagePreview;
      if (statusType === "image" && imageFile) {
        toast.info("Compressing and uploading flyer...");
        finalImageUrl = await uploadProductImage(imageFile);
      }

      const res = await fetch("/api/wholesale-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: statusType,
          title: title.trim(),
          content: content.trim() || null,
          imageUrl: finalImageUrl || null,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          status: "Active",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to publish status");
      }

      toast.success("Wholesale status activated successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview("");
      queryClient.invalidateQueries({ queryKey: ["admin-wholesale-statuses"] });
      queryClient.invalidateQueries({ queryKey: ["active-wholesale-status"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to publish status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (item: WholesaleStatusItem) => {
    if (updatingId || deletingId) return;
    setUpdatingId(item.id);
    try {
      const nextStatus = item.status === "Active" ? "Inactive" : "Active";
      const res = await fetch(`/api/wholesale-status/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Status set to ${nextStatus}`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-wholesale-statuses"] }),
        queryClient.invalidateQueries({ queryKey: ["active-wholesale-status"] }),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteStatus = async (id: number) => {
    if (updatingId || deletingId) return;
    if (!confirm("Are you sure you want to delete this status?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/wholesale-status/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Status deleted");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin-wholesale-statuses"] }),
        queryClient.invalidateQueries({ queryKey: ["active-wholesale-status"] }),
      ]);
    } catch (err: any) {
      toast.error(err.message || "Error deleting status");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (item: WholesaleStatusItem) => {
    const now = Date.now();
    const start = new Date(item.startTime).getTime();
    const end = new Date(item.endTime).getTime();

    if (item.status === "Inactive") {
      return (
        <Badge variant="outline" className="bg-neutral-100 text-neutral-600 border-neutral-300 font-medium">
          Inactive
        </Badge>
      );
    }

    if (now < start) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
          Scheduled
        </Badge>
      );
    }

    if (now > end) {
      return (
        <Badge variant="outline" className="bg-neutral-100 text-neutral-500 border-neutral-200 font-medium">
          Expired
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-medium flex items-center gap-1">
        <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
        Live on Wholesale
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6 w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
              <Megaphone className="size-5" />
            </span>
            Wholesale Status &amp; Announcements
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Post timed WhatsApp-style status updates and flyer notices visible exclusively on the wholesale catalog.
          </p>
        </div>

        <a
          href="/wholesale"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-3.5 py-2 rounded-xl transition-colors shrink-0"
        >
          <span>View Wholesale Page</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none">
        <CardHeader className="pb-4 border-b border-neutral-100">
          <CardTitle className="text-base font-bold text-neutral-900">
            Publish New Wholesale Status
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500">
            Choose whether to post a text notice or an image flyer, and choose how long it remains active.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 w-fit">
              <button
                type="button"
                onClick={() => setStatusType("text")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusType === "text"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Type className="size-3.5" />
                <span>Text Notice</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusType("image")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusType === "image"
                    ? "bg-white text-neutral-950 shadow-xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <ImageIcon className="size-3.5" />
                <span>Flyer / Image Status</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-800 block mb-1.5">
                  Status Heading / Headline *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Urgent Crown CD70 Engine Booking Open – Limited Stock!"
                  className="h-10 text-xs sm:text-sm bg-neutral-50/50"
                  required
                />
              </div>

              {statusType === "text" ? (
                <div>
                  <label className="text-xs font-semibold text-neutral-800 block mb-1.5">
                    Announcement Details / Message *
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the full announcement text, terms, or dealer information to display in the status viewer..."
                    rows={4}
                    className="text-xs sm:text-sm bg-neutral-50/50"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-800 block">
                    Upload Status Flyer / Image *
                  </label>
                  <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 text-center hover:border-red-400 transition-colors bg-neutral-50/40">
                    {imagePreview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-56 object-contain rounded-xl border border-neutral-200 shadow-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                          }}
                          className="text-xs h-8"
                        >
                          Change Flyer
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                          <UploadCloud className="size-6" />
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">
                          Click to upload flyer image
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          JPG, PNG, or WebP. Automatically compressed before uploading.
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-800 block mb-1.5">
                      Caption / Additional Notes (Optional)
                    </label>
                    <Input
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Optional caption displayed under the flyer"
                      className="h-10 text-xs sm:text-sm bg-neutral-50/50"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <label className="text-xs font-semibold text-neutral-800 block">
                Active Duration &amp; Scheduling
              </label>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "12h", label: "12 Hours" },
                  { id: "24h", label: "24 Hours (1 Day)" },
                  { id: "48h", label: "48 Hours (2 Days)" },
                  { id: "7d", label: "7 Days" },
                  { id: "custom", label: "Custom Dates" },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetChange(preset.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      durationPreset === preset.id
                        ? "bg-red-600 text-white border-red-600 font-semibold shadow-xs"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                    Start Displaying At
                  </span>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      setDurationPreset("custom");
                    }}
                    className="h-9 text-xs bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-neutral-500 block mb-1">
                    Expire &amp; Hide At
                  </span>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      setDurationPreset("custom");
                    }}
                    className="h-9 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-6 h-10 rounded-xl text-xs font-semibold shadow-sm gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Megaphone className="size-4" />
                    <span>Activate Wholesale Status</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-neutral-200/80 bg-white shadow-none overflow-hidden">
        <CardHeader className="pb-3 border-b border-neutral-100">
          <CardTitle className="text-base font-bold text-neutral-900">
            Status History &amp; Active Announcements
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500">
            View, manage, and audit all wholesale status campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50/70 hover:bg-neutral-50/70">
                <TableHead className="font-semibold text-neutral-700 text-xs py-3.5">Status</TableHead>
                <TableHead className="font-semibold text-neutral-700 text-xs">Type</TableHead>
                <TableHead className="font-semibold text-neutral-700 text-xs">Announcement Details</TableHead>
                <TableHead className="font-semibold text-neutral-700 text-xs">Active Window</TableHead>
                <TableHead className="font-semibold text-neutral-700 text-xs text-center">Views</TableHead>
                <TableHead className="font-semibold text-neutral-700 text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-neutral-500">
                    <Loader2 className="size-5 animate-spin mx-auto text-neutral-400 mb-2" />
                    Loading statuses...
                  </TableCell>
                </TableRow>
              ) : statuses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-neutral-500">
                    No wholesale statuses published yet.
                  </TableCell>
                </TableRow>
              ) : (
                statuses.map((item) => (
                  <TableRow key={item.id} className="hover:bg-neutral-50/50 text-xs">
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell>
                      <span className="capitalize font-medium text-neutral-700 flex items-center gap-1.5">
                        {item.type === "image" ? (
                          <ImageIcon className="size-3.5 text-blue-600" />
                        ) : (
                          <Type className="size-3.5 text-neutral-600" />
                        )}
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[280px]">
                      <p className="font-bold text-neutral-900 truncate leading-snug">
                        {item.title}
                      </p>
                      {item.content && (
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {item.content}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-neutral-600">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">From:</span>
                        <span>{new Date(item.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-[10px] text-neutral-400 block">Until:</span>
                        <span>{new Date(item.endTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-bold text-neutral-800">
                      <span className="inline-flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded-full text-[11px]">
                        <Eye className="size-3 text-neutral-500" />
                        {item.views || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewItem(item)}
                          className="h-8 px-2.5 text-xs text-neutral-700 hover:text-neutral-900 border-neutral-200 cursor-pointer gap-1.5"
                          title="Preview Status Popup"
                        >
                          <Eye className="size-3.5" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === item.id || deletingId === item.id}
                          onClick={() => toggleStatus(item)}
                          className={`h-8 px-2.5 text-xs border-neutral-200 gap-1.5 ${
                            item.status === "Active"
                              ? "text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                              : "text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
                          } ${updatingId === item.id ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                          title={item.status === "Active" ? "Pause Status" : "Activate Status"}
                        >
                          {updatingId === item.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Power className="size-3.5" />
                          )}
                          <span>
                            {updatingId === item.id
                              ? "Updating..."
                              : item.status === "Active"
                              ? "Pause"
                              : "Enable"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingId === item.id || deletingId === item.id}
                          onClick={() => deleteStatus(item.id)}
                          className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                          title="Delete Status"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <WholesaleStatusDialog
        status={previewItem}
        open={!!previewItem}
        onOpenChange={(open) => {
          if (!open) setPreviewItem(null);
        }}
      />
    </div>
  );
}

export default AdminWholesaleStatusSection;

