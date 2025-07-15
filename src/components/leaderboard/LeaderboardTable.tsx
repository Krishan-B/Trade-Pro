import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LeaderboardUser } from '@/hooks/useLeaderboardData';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ users }) => {
  const handleShare = (rank: number) => {
    const text = `I'm rank #${rank} on the Plexop leaderboard! Can you beat me?`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Plexop Leaderboard',
        text: text,
        url: url,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Total P&L</TableHead>
          <TableHead className="w-[150px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.rank}>
            <TableCell className="font-medium">{user.rank}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell className={`text-right ${user.total_pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {user.total_pnl.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" onClick={() => handleShare(user.rank)}>
                Share
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LeaderboardTable;