
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl text-arkade-blue mb-6">About Retro Arkade</h1>
      <div className="space-y-4 text-slate-700 text-lg">
        <p>
          Welcome to Retro Arkade, your portal to the past! We are dedicated to preserving and celebrating the golden age of internet gaming. Our mission is to provide a single, easy-to-use platform where you can enjoy the classic Flash and HTML5 games that defined a generation.
        </p>
        <p>
          Many of us grew up spending hours on sites like Newgrounds, Miniclip, and Armor Games. Those simple yet incredibly fun games were a huge part of our digital childhoods. With the decline of Flash technology, many of these gems have become difficult to find and play. That's where we come in.
        </p>
        <p>
          Using modern technology like the Ruffle.js emulator, we're bringing these classics back to life, making them playable on any modern browser without any plugins. We've also curated a selection of timeless HTML5 games that continue to entertain.
        </p>
        <p>
          But Retro Arkade is more than just a game archive. It's a community. By creating an account, you can post comments, compete for the top spot on our high score leaderboards, and share your nostalgia with fellow gamers.
        </p>
        <p>
          Thank you for visiting. We hope you have as much fun playing these games as we did curating them!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
