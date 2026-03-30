"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user.interface";
import Link from "next/link";

export default function ProfilePage({ user }: { user: IUser }) {
  const fullName = `${user.firstName} ${user.lastName ?? ""}`;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card className="rounded-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative w-24 h-24">
            <Image
              src={
                user.avatar ||
                "https://gravatar.com/avatar/7241272fc631f4c8c2d5a8e6b51d641b?s=400&d=robohash&r=x"
              }
              alt="avatar"
              fill
              sizes="(max-width: 768px) 40px, 48px"
              className="rounded-full object-cover border"
            />
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge variant={user.isVerified ? "default" : "secondary"}>
                {user.isVerified ? "Verified" : "Not Verified"}
              </Badge>

              <Badge variant="outline">{user.role}</Badge>

              {user.isBlocked && <Badge variant="destructive">Blocked</Badge>}
            </div>
          </div>

          <Button>
            <Link href="./profile/update">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold">{user.trustScore ?? 0}</p>
            <p className="text-xs text-muted-foreground">Trust Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold">{user.totalReports ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold">{user.correctReports ?? 0}</p>
            <p className="text-xs text-muted-foreground">Correct Reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-lg font-bold">
              {user.lastLoggedIn
                ? new Date(user.lastLoggedIn).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">Last Login</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info label="Phone" value={user.phone} />
          <Info label="Address" value={user.address} />
          <Info label="Gender" value={user.gender} />
          <Info label="Blood Group" value={user.bloodGroup} />
          <Info
            label="Date of Birth"
            value={
              user.dob ? new Date(user.dob).toLocaleDateString() : undefined
            }
          />
          <Info
            label="Joined"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : undefined
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "Not Provided"}</p>
    </div>
  );
}
