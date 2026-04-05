"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  createStationComment,
  getFollowStatus,
  getLikeStatus,
  followStation,
  getStationById,
  likeStation,
  loadCommentsByStation,
  unfollowStation,
  unlikeStation,
} from "@/service/stations.service";
import useAsyncAction from "@/hooks/useAsyncAction";
import StationForm from "../StationForm";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useAppSelector } from "@/hooks/reduxHooks";
import { ADMIN_ROLE } from "@/components/auth/AdminGuard";
import { axiosMessage } from "@/lib/axios-error";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Heart, UserCheck, UserPlus } from "lucide-react";
import Image from "next/image";
import { FuelStatus, type StationComment } from "@/interface/station.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CommentAvatar({ name, avatar }: { name: string; avatar?: string }) {
  const initials =
    name
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  if (avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user URLs may be arbitrary hosts
      <img
        src={avatar}
        alt=""
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground ring-1 ring-border">
      {initials}
    </div>
  );
}

function formatDateTimeUTC(value: unknown): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value as any);
  const t = d.getTime();
  if (!Number.isFinite(t)) return "—";
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function formatTimeAgoUTC(value: unknown, nowMs: number): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value as any);
  const t = d.getTime();
  if (!Number.isFinite(t)) return "—";

  const diffMs = nowMs - t;
  if (diffMs < 0) return "—";

  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 45) return "just now";
  if (diffSec < 90) return "1 minute ago";

  const minutes = Math.floor(diffSec / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

function createdAtToMs(value: unknown): number {
  if (!value) return 0;
  const d = value instanceof Date ? value : new Date(value as any);
  const t = d.getTime();
  return Number.isFinite(t) ? t : 0;
}

type CommentThreadProps = {
  comment: StationComment;
  all: StationComment[];
  depth: number;
  canReply: boolean;
  replyingToId: number | null;
  replyText: string;
  onReplyClick: (id: number) => void;
  onCancelReply: () => void;
  onReplyTextChange: (t: string) => void;
  onSubmitReply: (parentId: number) => void;
  replySubmitting: boolean;
};

function CommentThread({
  comment,
  all,
  depth,
  canReply,
  replyingToId,
  replyText,
  onReplyClick,
  onCancelReply,
  onReplyTextChange,
  onSubmitReply,
  replySubmitting,
}: CommentThreadProps) {
  const replies = all
    .filter((c) => c.parentId === comment.id)
    .sort((a, b) => createdAtToMs(b.createdAt) - createdAtToMs(a.createdAt));

  // Only show replies after user clicks "See replies",
  // unless they are in the middle of writing a reply to this comment.
  const [repliesOpen, setRepliesOpen] = useState(false);

  // Avoid hydration mismatch: don't compute relative time until mounted.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  // If user clicks Reply on this comment, show children.
  useEffect(() => {
    if (replyingToId === comment.id) setRepliesOpen(true);
  }, [replyingToId, comment.id]);

  const author = comment.user;
  const displayName =
    author?.name?.trim() ||
    [author?.firstName, author?.lastName].filter(Boolean).join(" ").trim() ||
    `User #${comment.userId}`;

  const replyCountLabel =
    replies.length === 1 ? "1 reply" : `${replies.length} replies`;

  return (
    <div className={depth > 0 ? "mt-3" : ""}>
      <div className="flex gap-3 rounded-lg border bg-background/80 p-3 shadow-sm">
        <CommentAvatar name={displayName} avatar={author?.avatar} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/90">
            {comment.text}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {nowMs ? formatTimeAgoUTC(comment.createdAt, nowMs) : "—"}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {canReply ? (
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={() => onReplyClick(comment.id)}
              >
                Reply
              </button>
            ) : null}
            {replies.length > 0 ? (
              <button
                type="button"
                className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                onClick={() => setRepliesOpen((v) => !v)}
              >
                {repliesOpen
                  ? "Hide replies"
                  : `See replies · ${replyCountLabel}`}
              </button>
            ) : null}
          </div>
          {replyingToId === comment.id ? (
            <div className="mt-3 space-y-2 rounded-md border bg-muted/30 p-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                className="min-h-20 resize-none text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancelReply}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!replyText.trim() || replySubmitting}
                  onClick={() => onSubmitReply(comment.id)}
                >
                  Reply
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {repliesOpen && replies.length > 0 ? (
        <div
          className={
            depth === 0
              ? "mt-3 space-y-0 border-l-2 border-border/70 pl-4"
              : "mt-3 space-y-0"
          }
        >
          {replies.map((r) => (
            <CommentThread
              key={r.id}
              comment={r}
              all={all}
              depth={depth + 1}
              canReply={canReply}
              replyingToId={replyingToId}
              replyText={replyText}
              onReplyClick={onReplyClick}
              onCancelReply={onCancelReply}
              onReplyTextChange={onReplyTextChange}
              onSubmitReply={onSubmitReply}
              replySubmitting={replySubmitting}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function StationDetailsPage() {
  const params = useParams();
  const stationId = Number(params.stationId);
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch when auth state (from localStorage/persist) differs
  // between server and first client render.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && user?.role === ADMIN_ROLE;

  // Relative time should be calculated only after mount to avoid hydration mismatch.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  const getStation = useAsyncAction(getStationById);
  const getComments = useAsyncAction(loadCommentsByStation);
  const fnLikeStatus = useAsyncAction(getLikeStatus);
  const fnFollowStatus = useAsyncAction(getFollowStatus);
  const fnLike = useAsyncAction(likeStation);
  const fnUnlike = useAsyncAction(unlikeStation);
  const fnFollow = useAsyncAction(followStation);
  const fnUnfollow = useAsyncAction(unfollowStation);
  const fnCreateComment = useAsyncAction(createStationComment);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentFilter, setCommentFilter] = useState<
    "all" | "my" | "newest" | "oldest" | "mostReply"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const COMMENTS_PER_PAGE = 30;

  // Fetch comments with filter and pagination
  useEffect(() => {
    if (!Number.isFinite(stationId) || stationId < 1) return;
    getStation.action(stationId); // Load station details
    getComments.action(stationId, {
      filter: commentFilter,
      page: currentPage,
      limit: COMMENTS_PER_PAGE,
    });
  }, [stationId, commentFilter, currentPage]); // Add commentFilter and currentPage to dependencies

  useEffect(() => {
    if (!mounted) return;
    if (!user) return;
    fnLikeStatus.action(stationId);
    fnFollowStatus.action(stationId);
  }, [mounted, user, stationId]);

  const isLiked = fnLikeStatus.data?.liked ?? false;
  const isFollowed = fnFollowStatus.data?.followed ?? false;

  const stationTitle = useMemo(() => {
    const s = getStation.data;
    if (!s) return "Station details";
    return s.name ?? s.brand ?? `Station #${s.id}`;
  }, [getStation.data]);

  const requireAuth = () => {
    if (!user) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const refreshStation = async () => {
    await getStation.action(stationId);
  };

  const refreshComments = async () => {
    await getComments.action(stationId, {
      filter: commentFilter,
      page: currentPage,
      limit: COMMENTS_PER_PAGE,
    });
  };

  async function handleLike() {
    if (!requireAuth()) return;
    try {
      await fnLike.action(stationId);
      await refreshStation();
      await fnLikeStatus.action(stationId);
      toast.success("Liked");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  async function handleUnlike() {
    if (!requireAuth()) return;
    try {
      await fnUnlike.action(stationId);
      await refreshStation();
      await fnLikeStatus.action(stationId);
      toast.success("Unliked");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  async function handleFollow() {
    if (!requireAuth()) return;
    try {
      await fnFollow.action(stationId);
      await refreshStation();
      await fnFollowStatus.action(stationId);
      toast.success("Followed");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  async function handleUnfollow() {
    if (!requireAuth()) return;
    try {
      await fnUnfollow.action(stationId);
      await refreshStation();
      await fnFollowStatus.action(stationId);
      toast.success("Unfollowed");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  async function handleCreateComment() {
    if (!requireAuth()) return;
    const t = commentText.trim();
    if (!t) return;
    try {
      await fnCreateComment.action(stationId, t);
      setCommentText("");
      await refreshComments();
      toast.success("Comment added");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  async function handleSubmitReply(parentId: number) {
    if (!requireAuth()) return;
    const t = replyText.trim();
    if (!t) return;
    try {
      await fnCreateComment.action(stationId, t, parentId);
      setReplyText("");
      setReplyingToId(null);
      await refreshComments();
      toast.success("Reply posted");
    } catch (e) {
      toast.error(axiosMessage(e) ?? String(e));
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:pb-30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
              {stationTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {[
                getStation.data?.village,
                getStation.data?.subDistrict?.name,
                getStation.data?.district?.name,
                getStation.data?.division?.name,
              ].filter(Boolean).length
                ? `Location: ${[
                  getStation.data?.village,
                  getStation.data?.subDistrict?.name,
                  getStation.data?.district?.name,
                  getStation.data?.division?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}`
                : "Location not Available"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2">
              {/* 👤 Follow */}
              <Button
                variant="outline"
                onClick={isFollowed ? handleUnfollow : handleFollow}
                disabled={
                  isFollowed ? fnUnfollow.onLoading : fnFollow.onLoading
                }
                className="flex items-center gap-1"
              >
                {isFollowed ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>

            {/* Update / Request Update */}
            {user ? (
              <Button onClick={() => setShowUpdateForm((x) => !x)}>
                {showUpdateForm ? "Close" : isAdmin ? "Update" : "Request Update"}
              </Button>
            ) : null}
          </div>
        </div>

        {/* details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border overflow-hidden bg-background">
              {/* Image */}
              <div className="relative w-full h-100">
                <Image
                  src={getStation.data?.avatar || "/gasStationObject.png"}
                  alt="Station Image"
                  fill
                  className="object-cover"
                />
                <p className="absolute top-0 right-1">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${getStation.data?.status === FuelStatus.AVAILABLE
                      ? "bg-green-100 text-green-700"
                      : getStation.data?.status === FuelStatus.LIMITED
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {getStation.data?.status === FuelStatus.AVAILABLE
                      ? "Available"
                      : getStation.data?.status === FuelStatus.LIMITED
                        ? "Limited"
                        : "Out of stock"}
                  </span>
                </p>
              </div>

              {/* LEFT: Station Details */}
              <div className="px-5 pb-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="">
                    <p className="text-lg lg:text-xl font-bold">
                      Details{" "}
                      <span className="text-base text-gray-400">
                        ( Following by {getStation.data?.followersCount ?? 0}{" "}
                        people )
                      </span>
                    </p>
                    {/* {getStation.data?.followersCount ?? 0} */}
                  </div>
                  <div>
                    {/* ❤️ Like */}
                    <Button
                      variant="outline"
                      onClick={isLiked ? handleUnlike : handleLike}
                      disabled={isLiked ? fnUnlike.onLoading : fnLike.onLoading}
                      className={`flex items-center gap-1 ${isLiked ? "text-destructive" : ""}`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                      />
                      {getStation.data?.likesCount ?? 0}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid grid-cols-2text-sm text-muted-foreground">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {getStation.data?.fuelTypes &&
                      Object.entries(getStation.data.fuelTypes).some(
                        ([, v]) => v === true
                      ) ? (
                      Object.entries(getStation.data.fuelTypes)
                        .filter(([, v]) => v === true)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="px-3 py-1 rounded-full border bg-muted text-xs capitalize"
                          >
                            {key}
                          </span>
                        ))
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                  {/* Fuel Prices */}
                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-base font-semibold text-foreground">
                      Fuel Prices
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {getStation.data?.prices &&
                        Object.entries(getStation.data.prices).some(
                          ([, v]) => v > 0
                        ) ? (
                        Object.entries(getStation.data.prices)
                          .filter(([, v]) => v > 0)
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="rounded-lg border p-3 bg-background"
                            >
                              <p className="text-xs text-muted-foreground capitalize">
                                {key}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {value} ৳
                              </p>
                            </div>
                          ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">
                      Location
                    </p>

                    <p>
                      <span className="text-foreground font-medium">
                        OSM Reference:
                      </span>{" "}
                      {getStation.data?.osmRef ?? "—"}
                    </p>
                    <p>
                      <span className="text-foreground font-medium">
                        Lat/Lng:
                      </span>{" "}
                      {getStation.data
                        ? `${getStation.data.lat}, ${getStation.data.lng}`
                        : "—"}
                    </p>
                    <p>
                      <span className="text-foreground font-medium">
                        Google Map:
                      </span>{" "}
                      {getStation.data?.googleMapLink ? (
                        <a
                          href={getStation.data.googleMapLink}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-primary"
                        >
                          Open
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground"></p>
                    <p>
                      <span className="text-foreground font-medium">
                        Opening Time:
                      </span>{" "}
                      {getStation.data?.openingTime ?? "—"}
                    </p>
                    <p>
                      <span className="text-foreground font-medium">
                        Last Update At:
                      </span>{" "}
                      {getStation.data?.updatedAt
                        ? nowMs
                          ? formatTimeAgoUTC(getStation.data.updatedAt, nowMs)
                          : "—"
                        : "—"}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-foreground font-medium">
                        Queue:
                      </span>

                      {getStation.data?.queueStatus ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border
                            ${getStation.data.queueStatus === "low"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : getStation.data.queueStatus === "medium"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                : "bg-red-100 text-red-700 border-red-300"
                            }`}
                        >
                          {getStation.data.queueStatus}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background flex flex-col">
            <div className="border rounded-xl p-5">
              <div className="mt-4 space-y-3 flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleCreateComment}
                    disabled={fnCreateComment.onLoading || !commentText.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex flex-row justify-between">
            <p className="text-base font-semibold">
              Discussion{" "}
              <span className="text-sm font-normal text-muted-foreground">
                ({(getComments.data?.data ?? []).length} comments)
              </span>
            </p>
            <Select
              value={commentFilter}
              onValueChange={(val) => {
                setCommentFilter(val as any);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter comments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Comments</SelectItem>
                <SelectItem value="my">My Comments</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="mostReply">Most Reply</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(() => {
            const comments = getComments.data?.data ?? [];
            if (comments.length === 0) {
              return (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              );
            }

            // Backend already filters and sorts, just display the paginated data
            // Separate parent comments from replies for threaded display
            const commentIdSet = new Set(comments.map((c) => c.id));
            const topLevelComments = comments.filter(
              (c) => !c.parentId || !commentIdSet.has(c.parentId)
            );

            return (
              <div className="space-y-6">
                {topLevelComments.map((parent) => (
                  <CommentThread
                    key={parent.id}
                    comment={parent}
                    all={comments}
                    depth={0}
                    canReply={!!user}
                    replyingToId={replyingToId}
                    replyText={replyText}
                    onReplyClick={(id) => {
                      setReplyingToId(id);
                      setReplyText("");
                    }}
                    onCancelReply={() => {
                      setReplyingToId(null);
                      setReplyText("");
                    }}
                    onReplyTextChange={setReplyText}
                    onSubmitReply={handleSubmitReply}
                    replySubmitting={fnCreateComment.onLoading}
                  />
                ))}
              </div>
            );
          })()}

          {/* Pagination Controls */}
          {getComments.data && getComments.data.total > COMMENTS_PER_PAGE && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of{" "}
                {Math.ceil(getComments.data.total / COMMENTS_PER_PAGE)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(
                        (getComments.data?.total || 1) / COMMENTS_PER_PAGE
                      ),
                      p + 1
                    )
                  )
                }
                disabled={
                  currentPage >=
                  Math.ceil((getComments.data?.total || 1) / COMMENTS_PER_PAGE)
                }
              >
                Next
              </Button>
            </div>
          )}
        </div>

        {/* Filter Info */}
        {getComments.data && commentFilter !== "all" && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {getComments.data.data.length} of {getComments.data.total}{" "}
            comments (Filtered by: {commentFilter})
          </div>
        )}
        {/* update form */}
        {user && showUpdateForm && getStation.data ? (
          <div className="mt-8 rounded-xl border p-4">
            <p className="text-sm font-medium">
              {isAdmin ? "Update station" : "Request station update"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAdmin
                ? "Update station fields and save."
                : "Submit changes for admin approval."}
            </p>
            <div className="mt-4">
              <StationForm
                defaultValues={getStation.data}
                mode={isAdmin ? "direct" : "request"}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
