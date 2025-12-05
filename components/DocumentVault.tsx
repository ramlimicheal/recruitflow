
import React, { useState } from 'react';
import { MOCK_DOCUMENTS, MOCK_FOLDERS } from '../constants';
import { Document, Folder } from '../types';
import { FileText, Download, Filter, Search, File, FileImage, Folder as FolderIcon, ChevronRight, UploadCloud, MoreVertical } from 'lucide-react';

const DocumentVault: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | 'all'>('all');
  
  const getIcon = (type: string) => {
    switch(type) {
        case 'pdf': return <FileText className="text-rose-500" size={24} />;
        case 'docx': return <FileText className="text-blue-500" size={24} />;
        case 'img': return <FileImage className="text-purple-500" size={24} />;
        default: return <File className="text-slate-400" size={24} />;
    }
  };

  const filteredDocs = MOCK_DOCUMENTS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === 'all' ? true : doc.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Vault</h2>
                <p className="text-slate-500 mt-1">Encrypted storage for sensitive recruitment assets.</p>
            </div>
            <div className="flex gap-3">
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium">
                    <UploadCloud size={18} /> Upload File
                 </button>
            </div>
        </div>

        <div className="flex gap-6 h-full">
            {/* Sidebar (Folders) */}
            <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Folders</div>
                <div className="space-y-1">
                    <button 
                        onClick={() => setSelectedFolder('all')}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFolder === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <FolderIcon size={16} className={selectedFolder === 'all' ? 'text-indigo-500' : 'text-slate-400'} />
                        All Files
                    </button>
                    {MOCK_FOLDERS.map(folder => (
                        <button 
                            key={folder.id}
                            onClick={() => setSelectedFolder(folder.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFolder === folder.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <FolderIcon size={16} className={selectedFolder === folder.id ? 'text-indigo-500' : 'text-slate-400'} />
                            {folder.name}
                        </button>
                    ))}
                </div>
                
                <div className="mt-auto p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 mb-2">Storage Usage</div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                        <div className="bg-indigo-500 h-1.5 rounded-full w-[45%]"></div>
                    </div>
                    <div className="text-[10px] text-slate-400">4.5 GB of 10 GB used</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                     <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search files..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                            <Filter size={18} />
                        </button>
                     </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Size</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Modified</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDocs.map((doc) => (
                                <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {getIcon(doc.type)}
                                            </div>
                                            <span className="font-medium text-slate-700 text-sm group-hover:text-indigo-700">{doc.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-500 font-mono">{doc.size}</td>
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-700">{doc.uploadedBy}</span>
                                            <span className="text-[10px] text-slate-400">{doc.uploadedAt}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredDocs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <FolderIcon size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">No files found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default DocumentVault;
