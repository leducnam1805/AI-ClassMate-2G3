'use client';

import React, { useState, useEffect } from 'react';
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
import { 
  fetchStudentsFromBackend, 
  updateStudentInBackend, 
  resolveIssueInBackend,
  regenerateDraftInBackend,
  batchApproveInBackend
} from '../services/api';

export default function Home() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(INITIAL_STUDENTS[0]);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Fetch real data from FastAPI backend (port 8000)
  useEffect(() => {
    fetchStudentsFromBackend()
      .then((data) => {
        if (data && data.length > 0) {
          setStudents(data);
          setSelectedStudent(data[0]);
          setIsBackendConnected(true);
        }
      })
      .catch(() => {
        setIsBackendConnected(false);
      });
  }, []);

  const handleUpdateStudent = async (updatedStudent: Student) => {
    // 1. Optimistic UI update
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }

    // 2. Persist to Backend API (SQLite)
    await updateStudentInBackend(updatedStudent.id, {
      audited_bonus: updatedStudent.auditedBonus,
      audited_penalty: updatedStudent.auditedPenalty,
      teacher_comment: updatedStudent.teacherComment,
      comment_status: updatedStudent.commentStatus
    });
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

      {/* Backend connection status pill */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1 text-xs flex justify-between items-center text-slate-600 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Kiến trúc phân tán: <strong>Frontend</strong> (Cổng 3000) &nbsp;⇄&nbsp; <strong>Backend FastAPI</strong> (Cổng 8000)
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px]">
          <span>Database: <strong className="text-indigo-600">SQLite (classmate.db)</strong></span>
          <span>•</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {isBackendConnected ? '✓ Kết nối API thành công' : 'Đang đồng bộ API'}
          </span>
        </div>
      </div>

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
