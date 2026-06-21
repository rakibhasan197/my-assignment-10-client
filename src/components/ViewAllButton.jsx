"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

export default function ViewAllButton() {
  return (
    <Link href={'/startups'}>
    <Button variant="secondary" className={'flex justify-center text-center mx-auto mt-5'}>
      View All Startups
    </Button>
    </Link>
  );
}