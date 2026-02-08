"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "./Skeleton";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

import Image from "next/image";

export function SkeletonExample() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setUser({
        name: "João Silva",
        email: "joao.silva@email.com",
        avatar: "/logo-3d.png",
        bio: "Estudante dedicado dos cursos bíblicos do Instituto Casa Bíblica."
      });
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="rounded-lg border border-cream-dark/10 bg-navy p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circular" width={64} height={64} />
          <div className="flex-1">
            <Skeleton variant="text" width={150} height={24} className="mb-2" />
            <Skeleton variant="text" width={200} height={16} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="90%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-cream-dark/10 bg-navy p-6">
      <div className="flex items-center gap-4 mb-4">
        <Image
          src={user.avatar}
          alt={user.name}
          width={64}
          height={64}
          className="h-16 w-16 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-cream">{user.name}</h3>
          <p className="text-sm text-cream-dark">{user.email}</p>
        </div>
      </div>
      <p className="text-cream-dark leading-relaxed">{user.bio}</p>
    </div>
  );
}