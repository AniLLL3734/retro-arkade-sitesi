
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';
import { GAMES } from '../constants';
import { Game, GameType, Comment as CommentType } from '../types';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { ChevronsRight, Send } from 'lucide-react';

// This component is defined outside GamePage to prevent re-creation on re-renders
const RufflePlayer: React.FC<{ game: Game }> = ({ game }) => {
    const ruffleContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Ruffle is loaded from index.html
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ruffle = (window as any).RufflePlayer?.newest();
        if (ruffle && ruffleContainer.current) {
            const player = ruffle.createPlayer();
            ruffleContainer.current.innerHTML = ''; // Clear previous
            ruffleContainer.current.appendChild(player);
            player.style.width = '100%';
            player.style.height = '100%';
            player.load(game.path);
        }
    }, [game.path]);

    return <div ref={ruffleContainer} style={{ width: game.width, height: game.height }} className="max-w-full mx-auto" />;
};

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [game, setGame] = useState<Game | null>(null);

  // State for comments
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  
  // State for score submission
  const [score, setScore] = useState('');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreError, setScoreError] = useState('');
  const [scoreSuccess, setScoreSuccess] = useState('');
  
  const fetchComments = useCallback(async () => {
    if (!id) return;
    setCommentError('');
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(username)')
            .eq('game_id', id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        setComments(data as any);
    } catch (err: any) {
        console.error("Error fetching comments:", err.message);
        setCommentError("Could not load comments: " + err.message);
    }
  }, [id]);

  useEffect(() => {
    const foundGame = GAMES.find(g => g.id === id) || null;
    setGame(foundGame);
    if (foundGame) {
      fetchComments();
    }
  }, [id, fetchComments]);

  useEffect(() => {
    if (!id) return;
    const channel = supabase.channel(`comments:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `game_id=eq.${id}` }, 
      () => {
        fetchComments(); // Re-fetch all to get user data
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !game) return;
    
    setIsSubmittingComment(true);
    setCommentError('');
    const { error } = await supabase
        .from('comments')
        .insert({ content: newComment, game_id: game.id, user_id: user.id });

    if (error) {
        console.error('Error posting comment:', error.message);
        setCommentError('Failed to post comment: ' + error.message);
    } else {
        setNewComment('');
    }
    setIsSubmittingComment(false);
  };

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !user || !game) {
        setScoreError("Please enter a score.");
        return;
    }

    const numericScore = parseInt(score, 10);
    if (isNaN(numericScore) || numericScore <= 0) {
        setScoreError("Please enter a valid positive number for your score.");
        return;
    }
    
    setIsSubmittingScore(true);
    setScoreError('');
    setScoreSuccess('');

    try {
        const { error } = await supabase.from('high_scores').insert({
            game_id: game.id,
            user_id: user.id,
            score: numericScore
        });
        if (error) throw error;
        setScoreSuccess(`Score submitted! View it on the High Scores page.`);
        setScore('');
    } catch (err: any) {
        console.error("Error submitting score:", err.message);
        setScoreError(err.message || "An error occurred submitting your score.");
    } finally {
        setIsSubmittingScore(false);
    }
  };

  if (!game) {
    return (
        <div className="text-center">
            <h2 className="text-3xl text-red-500">Game Not Found</h2>
            <p className="mt-4">We couldn't find the game you're looking for.</p>
            <Link to="/" className="mt-6 inline-block">
                <Button>
                    <ChevronsRight className="mr-2" />
                    Back to Home
                </Button>
            </Link>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-5xl text-arkade-blue">{game.name}</h1>
      </div>
      
      <div className="bg-black rounded-xl shadow-2xl p-2 flex justify-center items-center" style={{minHeight: game.height || 600}}>
          {game.type === GameType.HTML5 ? (
              <iframe
                  src={game.path}
                  width={game.width || '100%'}
                  height={game.height || 600}
                  className="border-0 rounded-lg"
                  title={game.name}
              ></iframe>
          ) : (
              <RufflePlayer game={game} />
          )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div>
            <h2 className="text-3xl text-arkade-orange">Instructions</h2>
            <p className="text-slate-700 mt-2">{game.instructions}</p>
          </div>
          <div>
            <h3 className="text-2xl text-arkade-orange">Description</h3>
            <p className="text-slate-700 mt-2">{game.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-3xl text-arkade-purple mb-4">Submit Score</h2>
          {authLoading ? <Spinner size="sm" /> : profile ? (
            <form onSubmit={handleScoreSubmit} className="space-y-3">
              <input
                type="number"
                placeholder="Enter your final score"
                value={score}
                onChange={e => setScore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                disabled={isSubmittingScore}
              />
              <Button type="submit" className="w-full" disabled={isSubmittingScore || !score}>
                {isSubmittingScore ? <Spinner size="sm" color="border-white" /> : 'Submit High Score'}
              </Button>
              {scoreError && <p className="text-red-500 text-sm">{scoreError}</p>}
              {scoreSuccess && <p className="text-green-500 text-sm">{scoreSuccess}</p>}
            </form>
          ) : (
            <p className="text-slate-600">
              <Link to="/login" className="text-arkade-blue font-bold hover:underline">Log in</Link> or <Link to="/signup" className="text-arkade-blue font-bold hover:underline">sign up</Link> to submit your score!
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-3xl text-arkade-purple mb-4">Comments ({comments.length})</h2>
        {authLoading ? <Spinner size="sm" /> : profile ? (
          <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-6">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
              disabled={isSubmittingComment}
            />
            <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
              {isSubmittingComment ? <Spinner size="sm" color="border-white"/> : <Send className="h-5 w-5" />}
            </Button>
          </form>
        ) : (
          <p className="text-slate-600 mb-6">
            <Link to="/login" className="text-arkade-blue font-bold hover:underline">Log in</Link> to join the conversation!
          </p>
        )}
        {commentError && <p className="text-red-500 text-sm mb-4">{commentError}</p>}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {comments.length > 0 ? comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg flex space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-arkade-purple text-white rounded-full flex items-center justify-center font-bold">
                {comment.profiles?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-bold text-arkade-blue">{comment.profiles?.username || 'Anonymous'}</p>
                <p className="text-slate-700">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
              </div>
            </div>
          )) : (
            !commentError && <p className="text-slate-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
