import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ExternalLink, 
  Clock, 
  TrendingUp, 
  Brain, 
  BarChart3,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: 'crypto' | 'forex' | 'stocks' | 'commodities' | 'general';
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
}

interface AnalysisInsight {
  id: string;
  title: string;
  content: string;
  type: 'technical' | 'fundamental' | 'sentiment' | 'ai';
  confidence: number;
  timeframe: string;
  assets: string[];
  createdAt: string;
}

const NewsCard: React.FC<{ news: NewsItem }> = ({ news }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {news.category.toUpperCase()}
          </Badge>
          <Badge className={`text-xs border ${getImpactColor(news.impact)}`}>
            {news.impact.toUpperCase()}
          </Badge>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
        {news.title}
      </h3>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {news.summary}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-muted-foreground">{news.source}</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span className="text-muted-foreground">{news.publishedAt}</span>
          </div>
        </div>
        <span className={`font-medium ${getSentimentColor(news.sentiment)}`}>
          {news.sentiment.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ insight: AnalysisInsight }> = ({ insight }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return <BarChart3 className="w-4 h-4" />;
      case 'fundamental': return <TrendingUp className="w-4 h-4" />;
      case 'sentiment': return <Brain className="w-4 h-4" />;
      case 'ai': return <Sparkles className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'technical': return 'text-blue-400';
      case 'fundamental': return 'text-green-400';
      case 'sentiment': return 'text-purple-400';
      case 'ai': return 'text-yellow-400';
      default: return 'text-muted-foreground';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-destructive';
  };

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={getTypeColor(insight.type)}>
            {getTypeIcon(insight.type)}
          </div>
          <Badge variant="secondary" className="text-xs">
            {insight.type.toUpperCase()}
          </Badge>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">
        {insight.title}
      </h3>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
        {insight.content}
      </p>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-wrap gap-1">
          {insight.assets.slice(0, 3).map((asset) => (
            <Badge key={asset} variant="outline" className="text-xs">
              {asset}
            </Badge>
          ))}
          {insight.assets.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{insight.assets.length - 3}
            </Badge>
          )}
        </div>
        <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
          {insight.confidence}% confidence
        </span>
      </div>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{insight.timeframe}</span>
        <span>{insight.createdAt}</span>
      </div>
    </div>
  );
};

const EnhancedNewsAnalysis: React.FC = () => {
  const [isLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('news');

  // Mock data - in real app this would come from API
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Bitcoin Reaches New Monthly High Amid Institutional Interest',
      summary: 'Major institutional investors continue to show strong interest in Bitcoin, driving prices to new monthly highs with increased trading volume.',
      source: 'CryptoNews',
      publishedAt: '2 hours ago',
      url: '#',
      category: 'crypto',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      id: '2',
      title: 'Fed Officials Signal Potential Rate Cuts This Quarter',
      summary: 'Federal Reserve officials hint at possible interest rate reductions, impacting forex markets and commodity prices significantly.',
      source: 'Financial Times',
      publishedAt: '4 hours ago',
      url: '#',
      category: 'forex',
      sentiment: 'positive',
      impact: 'high'
    },
    {
      id: '3',
      title: 'Tech Stocks Rally on AI Innovation Announcements',
      summary: 'Major technology companies announce breakthrough AI developments, leading to significant gains in tech stock indices.',
      source: 'TechCrunch',
      publishedAt: '6 hours ago',
      url: '#',
      category: 'stocks',
      sentiment: 'positive',
      impact: 'medium'
    }
  ];

  const mockInsights: AnalysisInsight[] = [
    {
      id: '1',
      title: 'Strong Bullish Pattern Detected in BTC/USD',
      content: 'Technical analysis indicates a strong bullish flag pattern forming in Bitcoin with potential upside target of $72,000. RSI shows healthy momentum without overbought conditions.',
      type: 'technical',
      confidence: 85,
      timeframe: '1-2 weeks',
      assets: ['BTCUSD', 'ETHUSD'],
      createdAt: '1 hour ago'
    },
    {
      id: '2',
      title: 'Dollar Weakness Expected to Continue',
      content: 'Fundamental analysis suggests continued USD weakness based on dovish Fed stance and improving global economic conditions. This could benefit commodity currencies.',
      type: 'fundamental',
      confidence: 72,
      timeframe: '2-4 weeks',
      assets: ['EURUSD', 'GBPUSD', 'AUDUSD'],
      createdAt: '3 hours ago'
    },
    {
      id: '3',
      title: 'AI-Powered Market Sentiment Analysis',
      content: 'Our AI models detect increasing positive sentiment across social media and news for renewable energy stocks, suggesting potential momentum building.',
      type: 'ai',
      confidence: 78,
      timeframe: '1-3 weeks',
      assets: ['TSLA', 'ENPH', 'SEDG'],
      createdAt: '5 hours ago'
    }
  ];

  const EmptyState: React.FC<{ type: 'news' | 'analysis' }> = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-slate-800 rounded-full p-6 mb-4">
        {type === 'news' ? (
          <ExternalLink className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Brain className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {type === 'news' ? 'No news available' : 'AI insights coming soon'}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {type === 'news' 
          ? 'Market news will appear here when available'
          : 'Advanced AI-powered market analysis will be available soon'
        }
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Market News Section */}
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Market News</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : mockNews.length === 0 ? (
          <EmptyState type="news" />
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>

      {/* Market Analysis Section */}
      <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Market Analysis</h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm">
            View All
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-5/6 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : mockInsights.length === 0 ? (
          <EmptyState type="analysis" />
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockInsights.map((insight) => (
              <AnalysisCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedNewsAnalysis;