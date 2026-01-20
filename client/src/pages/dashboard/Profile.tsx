/**
 * Profile Page
 * User profile management with Clerk integration
 * Sprint 8: User Dashboard & Protected Routes
 */

import { useUser, UserProfile } from "@clerk/clerk-react";
import { Link } from "wouter";
import { 
    User, 
    Mail, 
    Calendar, 
    Shield, 
    ArrowLeft,
    Settings,
    BookOpen,
    Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
    return (
          <ProtectedRoute>
                <ProfileContent />
          </ProtectedRoute>ProtectedRoute>
        );
}

function ProfileContent() {
    const { user, isLoaded } = useUser();
  
    if (!isLoaded || !user) {
          return null;
    }
  
    return (
          <div className="min-h-screen bg-slate-50">
            {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="flex items-center justify-between h-16">
                                              <div className="flex items-center gap-4">
                                                            <Link href="/dashboard">
                                                                            <Button variant="ghost" size="sm" className="gap-2">
                                                                                              <ArrowLeft className="h-4 w-4" />
                                                                                              Dashboard
                                                                            </Button>Button>
                                                            </Link>Link>
                                                            <h1 className="text-xl font-semibold text-slate-900">Mon Profil</h1>h1>
                                              </div>div>
                                              <Link href="/settings">
                                                            <Button variant="outline" size="sm" className="gap-2">
                                                                            <Settings className="h-4 w-4" />
                                                                            Paramètres
                                                            </Button>Button>
                                              </Link>Link>
                                  </div>div>
                        </div>div>
                </header>header>
          
            {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Profile Summary Card */}
                                  <div className="lg:col-span-1">
                                              <Card className="bg-white shadow-sm border-slate-200">
                                                            <CardContent className="pt-6">
                                                                            <div className="flex flex-col items-center text-center">
                                                                                              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-3xl font-bold mb-4">
                                                                                                {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
                                                                                                </div>div>
                                                                                              <h2 className="text-xl font-semibold text-slate-900">
                                                                                                {user.fullName || "Utilisateur"}
                                                                                                </h2>h2>
                                                                                              <p className="text-slate-500 text-sm mt-1">
                                                                                                {user.emailAddresses[0]?.emailAddress}
                                                                                                </p>p>
                                                                                              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                                                                                                                  <Calendar className="h-4 w-4" />
                                                                                                                  <span>Membre depuis {new Date(user.createdAt!).toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}</span>span>
                                                                                                </div>div>
                                                                            </div>div>
                                                            
                                                              {/* Quick Stats */}
                                                                            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                                                                                              <div className="text-center">
                                                                                                                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mx-auto mb-2">
                                                                                                                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                                                                                                    </div>div>
                                                                                                                  <p className="text-2xl font-bold text-slate-900">0</p>p>
                                                                                                                  <p className="text-</ProtectedRoute>
