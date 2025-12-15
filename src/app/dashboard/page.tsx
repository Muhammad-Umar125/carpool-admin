'use client';

import { Card, CardContent } from "@/app/components/ui/card";
import { Users, Car, UserCheck } from "lucide-react";

export default function DashboardPage() {
  // Mock data (replace with API calls or props)
  const stats = {
    totalUsers: 1200,
    activeDrivers: 350,
    activeCars: 280,
  };  

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Active Drivers",
      value: stats.activeDrivers,
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Active Cars",
      value: stats.activeCars,
      icon: <Car className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-md rounded-2xl">
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full ${card.bg} mr-4`}>
                {card.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm">{card.title}</p>
                <h2 className="text-xl font-bold">{card.value}</h2>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
