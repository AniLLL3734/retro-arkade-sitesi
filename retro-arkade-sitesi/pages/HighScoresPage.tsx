
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { GAMES } from '../constants';
import { HighScore } from '../types';
import Spinner from '../components/Spinner';
import { Trophy } from 'lucide-react';

const HighScoresPage: React.FC = () => {
    const [scores, setScores] = useState<HighScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedGame, setSelectedGame] = useState<string>('all');

    const fetchScores = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            let query = supabase
                .from('high_scores')
                .select('*, profiles(username)')
                .order('score', { ascending: false })
                .limit(100);

            if (selectedGame !== 'all') {
                query = query.eq('game_id', selectedGame);
            }

            const { data, error } = await query;

            if (error) throw error;
            setScores(data as any);

        } catch (err: any) {
            setError(`Could not fetch high scores: ${err.message}`);
            console.error("Error fetching high scores:", err);
        } finally {
            setLoading(false);
        }
    }, [selectedGame]);

    useEffect(() => {
        fetchScores();
    }, [fetchScores]);
    
    const getGameName = (gameId: string) => {
        return GAMES.find(g => g.id === gameId)?.name || 'Unknown Game';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-4xl text-arkade-blue mb-4 md:mb-0">High Scores</h1>
                <div className="flex items-center space-x-2">
                    <label htmlFor="game-filter" className="font-semibold text-slate-700">Filter by game:</label>
                    <select
                        id="game-filter"
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-arkade-orange focus:border-arkade-orange"
                    >
                        <option value="all">All Games</option>
                        {GAMES.map(game => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    {scores.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 font-bold text-slate-600">Rank</th>
                                    <th className="p-3 font-bold text-slate-600">Player</th>
                                    {selectedGame === 'all' && <th className="p-3 font-bold text-slate-600">Game</th>}
                                    <th className="p-3 font-bold text-slate-600">Score</th>
                                    <th className="p-3 font-bold text-slate-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scores.map((score, index) => (
                                    <tr key={score.id} className="border-b hover:bg-slate-50">
                                        <td className="p-3 font-bold text-lg text-arkade-purple flex items-center">
                                            {index < 3 && <Trophy className={`mr-2 h-5 w-5 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />}
                                            {index + 1}
                                        </td>
                                        <td className="p-3 font-semibold text-arkade-blue">{score.profiles?.username || 'Anonymous'}</td>
                                        {selectedGame === 'all' && <td className="p-3">{getGameName(score.game_id)}</td>}
                                        <td className="p-3 font-bold text-arkade-orange text-lg">{score.score.toLocaleString()}</td>
                                        <td className="p-3 text-slate-500">{new Date(score.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <p className="text-center text-slate-500 py-8">No scores found for this game. Be the first to set a record!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HighScoresPage;
