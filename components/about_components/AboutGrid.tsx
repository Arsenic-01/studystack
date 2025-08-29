"use client";

import { teamMembers } from "@/data/team";
import { MemberCard } from "./about_helper_components/MemberCard";
import { ContributionChart } from "./about_helper_components/ContributionChart";

export function AboutGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Map and render each team member's card */}
        {teamMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}

        {/* Add the contribution chart here */}
        <div className="md:col-span-2 lg:col-span-2">
          <ContributionChart members={teamMembers} />
        </div>
      </div>
    </div>
  );
}
