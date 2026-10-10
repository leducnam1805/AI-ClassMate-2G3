'use client';

import React, { useState } from 'react';
import { INITIAL_STUDENTS } from '../data/studentsData';
import { Student } from '../types';
import { Header } from '../components/Header';
import { Sidebar, TabKey } from '../components/Sidebar';
import { DashboardView } from '../components/DashboardView';
import { AuditTableView } from '../components/AuditTableView';
import { AIAssistantView } from '../components/AIAssistantView';
import { StudentProfileView } from '../components/StudentProfileView';
import { ResearchReportView } from '../components/ResearchReportView';
import { RulesSettingsView } from '../components/RulesSettingsView';

export default function Home() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(INITIAL_STUDENTS[0]);

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  // Calculations for Header
  const allIssues = students.flatMap(s => s.issues);
  const unresolvedIssues = allIssues.filter(i => !i.resolved);
  const approvedComments = students.filter(s => s.commentStatus === 'APPROVED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        unresolvedCount={unresolvedIssues.length}
        approvedCount={approvedComments.length}
        totalCount={students.length}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unresolvedCount={unresolvedIssues.length}
        />

        {/* Content Pane */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              onNavigate={setActiveTab}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setActiveTab('profiles');
              }}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTableView
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setActiveTab('profiles');
              }}
            />
          )}

          {activeTab === 'ai_assistant' && (
            <AIAssistantView
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onSelectStudent={(st) => {
                setSelectedStudent(st);
                setActiveTab('profiles');
              }}
            />
          )}

          {activeTab === 'profiles' && (
            <StudentProfileView
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
              onUpdateStudent={handleUpdateStudent}
            />
          )}

          {activeTab === 'research' && (
            <ResearchReportView
              students={students}
            />
          )}

          {activeTab === 'rules' && (
            <RulesSettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
