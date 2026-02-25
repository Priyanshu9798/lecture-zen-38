import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLectures, searchLectures } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Upload, Calendar, BookOpen, Brain, Clock } from 'lucide-react';
import type { Lecture } from '@/types';

function LectureCard({ lecture }: { lecture: Lecture }) {
  return (
    <Link to={`/lecture/${lecture.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/40">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-tight">{lecture.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {lecture.fileType === 'audio' ? '🎧 Audio' : '📄 PDF'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{lecture.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{Math.round(lecture.duration / 60)}min</span>
            {lecture.quizScore !== undefined && (
              <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5" />Quiz: {lecture.quizScore}%</span>
            )}
            {lecture.nextReviewDate && (
              <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />Review: {lecture.nextReviewDate}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LectureCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const { data: lectures, isLoading } = useQuery({
    queryKey: ['lectures', searchQuery],
    queryFn: () => searchQuery ? searchLectures(searchQuery) : getLectures(),
  });

  const filteredLectures = (lectures || []).filter(l => {
    if (dateFilter === 'all') return true;
    const d = new Date(l.date);
    const now = new Date();
    if (dateFilter === 'week') return (now.getTime() - d.getTime()) < 7 * 86400000;
    if (dateFilter === 'month') return (now.getTime() - d.getTime()) < 30 * 86400000;
    return true;
  });

  return (
    <AppLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="text-primary">{user?.name || 'Student'}</span> 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Here are your uploaded lectures</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lectures..."
              className="pl-9"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <LectureCardSkeleton key={i} />)}
          </div>
        ) : filteredLectures.length === 0 ? (
          <Card className="py-16 text-center">
            <CardContent>
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">No lectures yet</h2>
              <p className="mb-4 text-muted-foreground">Upload your first lecture to get started with AI-powered analysis</p>
              <Button asChild>
                <Link to="/upload"><Upload className="mr-2 h-4 w-4" />Upload Lecture</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLectures.map(l => <LectureCard key={l.id} lecture={l} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
