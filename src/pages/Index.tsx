import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, AlertTriangle, Clock, Shield, Monitor, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";
import CryptoJS from "crypto-js";

const Index = () => {
  const currentYearShort = String(new Date().getFullYear()).slice(-2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-professional-light via-background to-professional-light">
      {/* Header */}
      {/* <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded shadow">
              <img
                src="https://icrewsystems.com/frontend/public/images/logos/icrewsystems_logo_highres.png"
                alt="icrewsystems Logo"
                className="h-6 w-auto mr-2"
              />
              <span className="text-sm text-gray-600">- Self Interview</span>
            </div>
            <Badge variant="secondary" className="bg-primary-hover text-white">
              Round 0
            </Badge>
          </div>
        </div>
      </div> */}

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4 text-red-600">
          Whoops, invalid code
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8 text-center">
          Please apply for jobs at <strong>ICREWSYSTEMS</strong> using the button below.
        </p>
        <a
          href="https://icrewsystems.com/careers/current-openings"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <svg
            className="mr-2 w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
          Apply Now
        </a>
      </div>
      {/* <section className="relative bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white shadow-lg rounded-xl p-8 md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">
                Interested in Collaborating?
              </h4>
              <p className="text-gray-700 text-base leading-relaxed">
                Whether you’re from academia or industry, we welcome collaborations to push the boundaries of innovation.
              </p>
            </div>
            <div className="mt-6 md:mt-0 md:w-1/2 flex justify-start md:justify-end">
              <a
                href="/schedule-a-meet"
                className="inline-flex items-center px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-md transition duration-300"
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <div className="bg-muted mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            ICREWSYSTEMS SOFTWARE ENGINEERING LLP © 2016-{currentYearShort}. All rights reserved 💖
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
