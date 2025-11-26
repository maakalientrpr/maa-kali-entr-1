import React from "react";
import { Badge } from "../ui/badge";

const StatusBadge = ({ status }: { status: string }) => {
  
  return (
    <Badge
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
