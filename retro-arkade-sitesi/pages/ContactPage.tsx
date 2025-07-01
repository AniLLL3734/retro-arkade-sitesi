
import React from 'react';
import { Mail, Gamepad2 } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl text-arkade-blue mb-6">Contact Us</h1>
      <div className="space-y-6 text-slate-700">
        <p className="text-lg">
          Have a question, suggestion, or a game you'd love to see added to our collection? We'd love to hear from you!
        </p>
        <div className="flex items-center space-x-4 p-4 bg-slate-100 rounded-lg">
          <Mail className="h-8 w-8 text-arkade-orange" />
          <div>
            <h3 className="text-xl font-semibold text-arkade-purple">General Inquiries</h3>
            <a href="mailto:contact@retroarkade.com" className="text-arkade-blue hover:underline">
              contact@retroarkade.com
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4 bg-slate-100 rounded-lg">
          <Gamepad2 className="h-8 w-8 text-arkade-orange" />
          <div>
            <h3 className="text-xl font-semibold text-arkade-purple">Game Submissions</h3>
            <a href="mailto:games@retroarkade.com" className="text-arkade-blue hover:underline">
              games@retroarkade.com
            </a>
          </div>
        </div>
        <p>
          Please note that we are a small team, but we do our best to respond to all messages within a few business days.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
