"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  createStationComment,
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

export default function StationDetailsPage() {
  const params = useParams();
  const stationId = Number(params.stationId);
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === ADMIN_ROLE;

  const getStation = useAsyncAction(getStationById);
  const getComments = useAsyncAction(loadCommentsByStation);
  const fnLike = useAsyncAction(likeStation);
  const fnUnlike = useAsyncAction(unlikeStation);
  const fnFollow = useAsyncAction(followStation);
  const fnUnfollow = useAsyncAction(unfollowStation);
  const fnCreateComment = useAsyncAction(createStationComment);

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!Number.isFinite(stationId) || stationId < 1) return;
    getStation.action(stationId);
    getComments.action(stationId);
  }, []);

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
    await getComments.action(stationId);
  };

  async function handleLike() {
    if (!requireAuth()) return;
    try {
      await fnLike.action(stationId);
      await refreshStation();
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-salsa text-2xl font-semibold tracking-tight sm:text-3xl">
              {stationTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {getStation.data?.village ??
                getStation.data?.subDistrict?.name ??
                getStation.data?.district?.name ??
                "Location not specified"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleLike}
              disabled={fnLike.onLoading}
            >
              Like ({getStation.data?.likesCount ?? 0})
            </Button>
            <Button
              variant="outline"
              onClick={handleUnlike}
              disabled={fnUnlike.onLoading}
            >
              Unlike
            </Button>
            <Button
              variant="outline"
              onClick={handleFollow}
              disabled={fnFollow.onLoading}
            >
              Follow ({getStation.data?.followersCount ?? 0})
            </Button>
            <Button
              variant="outline"
              onClick={handleUnfollow}
              disabled={fnUnfollow.onLoading}
            >
              Unfollow
            </Button>

            {isAdmin ? (
              <Button onClick={() => setShowUpdateForm((x) => !x)}>
                {showUpdateForm ? "Close update" : "Update"}
              </Button>
            ) : null}
          </div>
        </div>

        {/* details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">Details</p>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground font-medium">OSM Ref:</span>{" "}
                {getStation.data?.osmRef ?? "—"}
              </p>
              <p>
                <span className="text-foreground font-medium">Lat/Lng:</span>{" "}
                {getStation.data
                  ? `${getStation.data.lat}, ${getStation.data.lng}`
                  : "—"}
              </p>
              <p>
                <span className="text-foreground font-medium">Status:</span>{" "}
                {getStation.data?.status ?? "—"} /{" "}
                {getStation.data?.queueStatus ?? "—"}
              </p>
              <p>
                <span className="text-foreground font-medium">Opening:</span>{" "}
                {getStation.data?.openingTime ?? "—"}
              </p>
              <p>
                <span className="text-foreground font-medium">Google map:</span>{" "}
                {getStation.data?.googleMapLink ? (
                  <a
                    href={getStation.data.googleMapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm font-medium">Comments</p>

            <div className="mt-3 space-y-3">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCreateComment}
                  disabled={fnCreateComment.onLoading || !commentText.trim()}
                >
                  Comment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void refreshComments()}
                  disabled={getComments.onLoading}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {(getComments.data ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              ) : (
                (getComments.data ?? []).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-lg border bg-background/70 p-3"
                  >
                    <p className="text-sm text-foreground">{c.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      User #{c.userId}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* update form */}
        {isAdmin && showUpdateForm && getStation.data ? (
          <div className="mt-8 rounded-xl border p-4">
            <p className="text-sm font-medium">Update station</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Update station fields and save.
            </p>
            <div className="mt-4">
              <StationForm defaultValues={getStation.data} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
