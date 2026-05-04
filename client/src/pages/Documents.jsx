import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Folder, FileText, Image, File, Search, Grid, List, Upload, 
  Download, Trash2, Share2, Eye, Edit, Clock, Star, StarOff, 
  ChevronRight, FileAudio, FileVideo, FileArchive, FolderPlus, 
  X, RefreshCw, CheckCircle, AlertCircle, MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { Layout } from '../components/Layout';
import { documentsApi } from '../api/documents';

const DocumentsPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const fileInputRef = useRef(null);
  
  const getSection = () => {
    const pathLower = path.toLowerCase();
    if (pathLower.includes('/shared')) return 'shared';
    if (pathLower.includes('/recent')) return 'recent';
    if (pathLower.includes('/starred')) return 'starred';
    if (pathLower.includes('/trash')) return 'trash';
    if (pathLower.includes('/templates')) return 'templates';
    if (pathLower.includes('/contracts')) return 'contracts';
    if (pathLower.includes('/policies')) return 'policies';
    return 'all';
  };
  
  const [activeSection, setActiveSection] = useState(getSection());
  const [documents, setDocuments] = useState([]);
  const [trashItems, setTrashItems] = useState([]);
  const [storage, setStorage] = useState({ used: 8.4, total: 15, percentage: 56 });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [notification, setNotification] = useState(null);
  
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);
  
  useEffect(() => {
    const newSection = getSection();
    setActiveSection(newSection);
    loadDocuments(newSection);
  }, [path]);
  
  const loadDocuments = async (section) => {
    setLoading(true);
    try {
      if (section === 'trash') {
        const data = await documentsApi.getTrash();
        setTrashItems(data.documents || data);
      } else {
        const data = await documentsApi.getAll(currentFolder, section);
        setDocuments(data.documents || []);
        setStorage(data.storage || { used: 8.4, total: 15, percentage: 56 });
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      showNotification('error', 'Failed to load documents');
    }
    setLoading(false);
  };
  
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: 'Home' }]);
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    
    setUploading(true);
    for (const file of files) {
      await handleUpload(file);
    }
    setUploading(false);
  };
  
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    for (const file of files) {
      await handleUpload(file);
    }
    setUploading(false);
    e.target.value = '';
  };
  
  const handleUpload = async (file) => {
    try {
      showNotification('info', `Uploading ${file.name}...`);
      await documentsApi.upload(file, currentFolder);
      showNotification('success', `"${file.name}" uploaded successfully`);
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Upload failed:', err);
      showNotification('error', `Failed to upload "${file.name}"`);
    }
  };
  
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      showNotification('error', 'Please enter a folder name');
      return;
    }
    try {
      await documentsApi.createFolder(newFolderName, currentFolder);
      setNewFolderName('');
      setShowFolderModal(false);
      showNotification('success', `Folder "${newFolderName}" created successfully`);
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Create folder failed:', err);
      showNotification('error', 'Failed to create folder');
    }
  };
  
  const handleStar = async (doc) => {
    try {
      await documentsApi.star(doc.id);
      showNotification('success', doc.starred ? 'Removed from starred' : 'Added to starred');
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Star failed:', err);
      showNotification('error', 'Failed to update star');
    }
  };
  
  const handleShare = async (doc) => {
    try {
      await documentsApi.share(doc.id);
      showNotification('success', doc.shared ? 'Removed from shared' : 'Added to shared');
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Share failed:', err);
      showNotification('error', 'Failed to update share');
    }
  };
  
  const handleRename = async () => {
    if (!newFileName.trim() || !selectedDoc) {
      showNotification('error', 'Please enter a valid name');
      return;
    }
    try {
      await documentsApi.rename(selectedDoc.id, newFileName);
      setNewFileName('');
      setSelectedDoc(null);
      setShowRenameModal(false);
      showNotification('success', 'File renamed successfully');
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Rename failed:', err);
      showNotification('error', 'Failed to rename file');
    }
  };
  
  const handleDelete = async (doc) => {
    try {
      await documentsApi.delete(doc.id);
      showNotification('success', `"${doc.name}" moved to trash`);
      loadDocuments(activeSection);
    } catch (err) {
      console.error('Delete failed:', err);
      showNotification('error', 'Failed to delete file');
    }
  };
  
  const handleRestore = async (doc) => {
    try {
      await documentsApi.restoreTrash(doc.id);
      showNotification('success', `"${doc.name}" restored`);
      loadDocuments('trash');
    } catch (err) {
      console.error('Restore failed:', err);
      showNotification('error', 'Failed to restore file');
    }
  };
  
  const handlePermanentDelete = async (doc) => {
    try {
      await documentsApi.permanentDelete(doc.id);
      showNotification('success', `"${doc.name}" permanently deleted`);
      loadDocuments('trash');
    } catch (err) {
      console.error('Permanent delete failed:', err);
      showNotification('error', 'Failed to delete file');
    }
  };
  
  const handleEmptyTrash = async () => {
    try {
      await documentsApi.emptyTrash();
      showNotification('success', 'Trash emptied successfully');
      loadDocuments('trash');
    } catch (err) {
      console.error('Empty trash failed:', err);
      showNotification('error', 'Failed to empty trash');
    }
  };
  
  const openRename = (doc) => {
    setSelectedDoc(doc);
    setNewFileName(doc.name);
    setShowRenameModal(true);
    setMenuOpen(null);
  };
  
  const navigateToFolder = (folder) => {
    setCurrentFolder(folder.id);
    setBreadcrumb([...breadcrumb, { id: folder.id, name: folder.name }]);
    loadDocuments(activeSection);
  };
  
  const navigateToBreadcrumb = (index) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setCurrentFolder(newBreadcrumb[index].id);
    loadDocuments(activeSection);
  };
  
  const getFileIcon = (type, fileType) => {
    if (type === 'folder') return { icon: Folder, color: 'text-blue-500' };
    const icons = {
      pdf: { icon: FileText, color: 'text-red-500' },
      doc: { icon: FileText, color: 'text-blue-500' },
      docx: { icon: FileText, color: 'text-blue-500' },
      xlsx: { icon: FileText, color: 'text-green-500' },
      xls: { icon: FileText, color: 'text-green-500' },
      image: { icon: Image, color: 'text-purple-500' },
      png: { icon: Image, color: 'text-purple-500' },
      jpg: { icon: Image, color: 'text-purple-500' },
      jpeg: { icon: Image, color: 'text-purple-500' },
      video: { icon: FileVideo, color: 'text-yellow-500' },
      mp4: { icon: FileVideo, color: 'text-yellow-500' },
      audio: { icon: FileAudio, color: 'text-pink-500' },
      mp3: { icon: FileAudio, color: 'text-pink-500' },
      archive: { icon: FileArchive, color: 'text-orange-500' },
      zip: { icon: FileArchive, color: 'text-orange-500' },
    };
    return icons[fileType] || { icon: File, color: 'text-slate-500' };
  };
  
  const filteredDocs = documents.filter(doc => {
    if (searchQuery) {
      return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });
  
  const getTitle = () => {
    const titles = {
      all: 'All Files',
      shared: 'Shared with Me',
      recent: 'Recent Files',
      starred: 'Starred',
      trash: 'Trash',
      templates: 'Templates',
      contracts: 'Contracts',
      policies: 'Policies',
    };
    return titles[activeSection] || 'Documents';
  };

  const templates = [
    { name: 'Invoice Template', desc: 'Professional invoice layout', type: 'pdf', icon: FileText },
    { name: 'Contract Template', desc: 'Standard service agreement', type: 'doc', icon: FileText },
    { name: 'Proposal Template', desc: 'Sales proposal format', type: 'doc', icon: FileText },
    { name: 'NDA Template', desc: 'Non-disclosure agreement', type: 'pdf', icon: FileText },
    { name: 'Employee Offer Letter', desc: 'New hire onboarding', type: 'doc', icon: FileText },
    { name: 'Project Brief', desc: 'Project initiation document', type: 'doc', icon: FileText },
  ];

  const contracts = [
    { name: 'Service Agreement - Acme', party: 'Acme Corp', status: 'active', expiry: '2024-12-31', value: '$50,000' },
    { name: 'NDA - TechStart', party: 'TechStart Inc', status: 'active', expiry: '2025-06-15', value: 'N/A' },
    { name: 'Consulting Contract', party: 'GlobalTech', status: 'expiring', expiry: '2024-02-28', value: '$25,000' },
    { name: 'Vendor Agreement', party: 'AWS Services', status: 'draft', expiry: '-', value: '$12,000' },
  ];

  const policies = [
    { name: 'Employee Handbook', desc: 'General policies and guidelines', updated: '2024-01-01' },
    { name: 'Data Security Policy', desc: 'Information security guidelines', updated: '2024-01-15' },
    { name: 'Leave Policy', desc: 'Vacation and leave guidelines', updated: '2023-12-01' },
    { name: 'Remote Work Policy', desc: 'Work from home guidelines', updated: '2024-01-10' },
    { name: 'Code of Conduct', desc: 'Professional behavior standards', updated: '2023-11-15' },
    { name: 'IT Usage Policy', desc: 'Technology and software guidelines', updated: '2024-01-05' },
  ];

  const renderModal = (show, onClose, title, content) => (
    show && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`rounded-2xl p-6 w-96 ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
            <button onClick={onClose} className={`p-1 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100'}`}>
              <X size={20} />
            </button>
          </div>
          {content}
        </div>
      </div>
    )
  );

  const renderDocCard = (doc, index) => {
    const icon = getFileIcon(doc.type, doc.fileType);
    const Icon = icon.icon;
    
    return (
      <div 
        key={doc.id || index} 
        onClick={() => doc.type === 'folder' && navigateToFolder(doc)}
        className={`p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] group ${isDark ? 'bg-slate-900 border-slate-700 hover:border-primary-500' : 'bg-white border-slate-200 hover:border-primary-500'}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Icon size={28} className={icon.color} />
          </div>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === doc.id ? null : doc.id); }}
              className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
            >
              <MoreHorizontal size={16} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </button>
            {menuOpen === doc.id && (
              <div className={`absolute right-0 top-8 z-10 rounded-lg border shadow-lg py-1 min-w-[120px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                {doc.type !== 'folder' && (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); handleStar(doc); setMenuOpen(null); }} className={`w-full px-3 py-2 text-left text-sm ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                      {doc.starred ? 'Unstar' : 'Star'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleShare(doc); setMenuOpen(null); }} className={`w-full px-3 py-2 text-left text-sm ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                      {doc.shared ? 'Unshare' : 'Share'}
                    </button>
                  </>
                )}
                <button onClick={(e) => { e.stopPropagation(); openRename(doc); }} className={`w-full px-3 py-2 text-left text-sm ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                  Rename
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(doc); setMenuOpen(null); }} className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.name}</h3>
        <div className={`flex items-center justify-between mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{doc.size || (doc.type === 'folder' ? `${doc.items} items` : '')}</span>
          <span>{doc.modified || ''}</span>
        </div>
        {doc.starred && <Star size={12} className="text-yellow-500 absolute top-4 right-4" fill="currentColor" />}
      </div>
    );
  };

  return (
    <Layout>
      <div 
        className="space-y-6"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="fixed inset-0 bg-primary-500/20 border-4 border-dashed border-primary-500 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-center">
              <Upload size={64} className="text-primary-500 mx-auto mb-4" />
              <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Drop files here to upload</p>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-primary-500 text-white rounded-lg shadow-lg">
            <RefreshCw size={20} className="animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        )}
        
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : 
             notification.type === 'error' ? <AlertCircle size={20} /> : <Clock size={20} />}
            <span className="text-sm font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80"><X size={16} /></button>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{getTitle()}</h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage your files and documents</p>
          </div>
          {activeSection !== 'trash' && activeSection !== 'templates' && activeSection !== 'contracts' && activeSection !== 'policies' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowFolderModal(true)} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'border-slate-600 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'}`}
              >
                <FolderPlus size={16} />
                <span className="text-sm">New Folder</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
              >
                <Upload size={16} />
                <span className="text-sm">Upload</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                onChange={handleFileSelect} 
              />
            </div>
          )}
        </div>

        {activeSection !== 'trash' && activeSection !== 'templates' && activeSection !== 'contracts' && activeSection !== 'policies' && (
          <>
            <div className="flex items-center gap-4">
              <div className={`flex-1 relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg`}>
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg bg-transparent outline-none ${isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-500'}`}
                />
              </div>
              <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {breadcrumb.length > 1 && (
              <div className="flex items-center gap-1">
                {breadcrumb.map((item, idx) => (
                  <span key={idx} className="flex items-center">
                    {idx > 0 && <ChevronRight size={16} className="mx-1 text-slate-400" />}
                    <button 
                      onClick={() => navigateToBreadcrumb(idx)} 
                      className={`text-sm ${idx === breadcrumb.length - 1 ? (isDark ? 'text-white font-medium' : 'text-slate-900 font-medium') : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      {item.name}
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Storage: {storage.used} GB / {storage.total} GB ({storage.percentage || Math.round(storage.used / storage.total * 100)}% used)
            </div>
          </>
        )}

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={32} className="animate-spin text-primary-500 mx-auto" />
          </div>
        ) : activeSection === 'all' && (
          filteredDocs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No files found. Upload or create a folder to get started.
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredDocs.map(renderDocCard)}
            </div>
          ) : (
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Name</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Size</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Modified</th>
                    <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredDocs.map((doc) => {
                    const icon = getFileIcon(doc.type, doc.fileType);
                    const Icon = icon.icon;
                    return (
                      <tr key={doc.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Icon size={18} className={icon.color} />
                            <span 
                              onClick={() => doc.type === 'folder' && navigateToFolder(doc)} 
                              className={`font-medium cursor-pointer hover:text-primary-500 ${isDark ? 'text-white' : 'text-slate-900'}`}
                            >
                              {doc.name}
                            </span>
                            {doc.starred && <Star size={14} className="text-yellow-500" fill="currentColor" />}
                          </div>
                        </td>
                        <td className={`px-5 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.size || (doc.type === 'folder' ? `${doc.items} items` : '')}</td>
                        <td className={`px-5 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.modified}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1">
                            {doc.type !== 'folder' && (
                              <button onClick={() => handleShare(doc)} className={`p-1.5 rounded-lg ${doc.shared ? 'text-primary-500' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`} title="Share">
                                <Share2 size={16} />
                              </button>
                            )}
                            <button onClick={() => openRename(doc)} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`} title="Rename">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(doc)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeSection === 'starred' && (
          filteredDocs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No starred files.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocs.map(renderDocCard)}
            </div>
          )
        )}

        {activeSection === 'shared' && (
          filteredDocs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No shared files.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocs.map(renderDocCard)}
            </div>
          )
        )}

        {activeSection === 'recent' && (
          filteredDocs.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No recent files.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocs.map(renderDocCard)}
            </div>
          )
        )}

        {activeSection === 'trash' && (
          trashItems.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trash is empty.</div>
          ) : (
            <div className="space-y-4">
              {trashItems.length > 0 && (
                <div className="flex justify-end">
                  <button 
                    onClick={handleEmptyTrash} 
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
                  >
                    Empty Trash
                  </button>
                </div>
              )}
              <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <table className="w-full">
                  <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                    <tr>
                      <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Name</th>
                      <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Deleted</th>
                      <th className={`px-5 py-3 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {trashItems.map((doc) => {
                      const icon = getFileIcon(doc.type, doc.fileType);
                      const Icon = icon.icon;
                      return (
                        <tr key={doc.id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <Icon size={18} className="text-slate-500" />
                              <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{doc.name}</span>
                            </div>
                          </td>
                          <td className={`px-5 py-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{doc.deletedAt?.split('T')[0]}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleRestore(doc)} className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-green-400' : 'text-slate-400 hover:text-green-600'}`} title="Restore">
                                <RefreshCw size={16} />
                              </button>
                              <button onClick={() => handlePermanentDelete(doc)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10" title="Permanent Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {activeSection === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {templates.map((tpl, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.02] ${isDark ? 'bg-slate-900 border-slate-700 hover:border-primary-500' : 'bg-white border-slate-200 hover:border-primary-500'}`}>
                <div className={`p-3 rounded-xl w-fit mb-4 ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                  <tpl.icon size={24} className="text-primary-500" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tpl.name}</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tpl.desc}</p>
                <span className={`mt-3 inline-block px-2 py-1 rounded text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{tpl.type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'contracts' && (
          <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <table className="w-full">
              <thead className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                <tr>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Contract Name</th>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Party</th>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Value</th>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Status</th>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Expiry</th>
                  <th className={`px-5 py-4 text-left text-xs font-semibold ${isDark ? 'text-slate-400 uppercase' : 'text-slate-500 uppercase'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {contracts.map((c, idx) => (
                  <tr key={idx} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-primary-500" />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</span>
                      </div>
                    </td>
                    <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{c.party}</td>
                    <td className={`px-5 py-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{c.value}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        c.status === 'active' ? 'bg-green-500/20 text-green-500' :
                        c.status === 'expiring' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-slate-500/20 text-slate-500'
                      }`}>{c.status}</span>
                    </td>
                    <td className={`px-5 py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.expiry}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-primary-500/10 text-primary-500"><Eye size={16} /></button>
                        <button className={`p-1.5 rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}><Download size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {policies.map((policy, idx) => (
              <div key={idx} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <FileText size={24} className="text-blue-500" />
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Updated: {policy.updated}</span>
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{policy.name}</h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{policy.desc}</p>
                <div className="flex gap-2">
                  <button className={`flex-1 py-2 rounded-lg text-sm ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} flex items-center justify-center gap-2`}>
                    <Eye size={14} /> View
                  </button>
                  <button className="flex-1 py-2 rounded-lg text-sm bg-primary-500 text-white hover:bg-primary-600 flex items-center justify-center gap-2">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {renderModal(showFolderModal, () => { setShowFolderModal(false); setNewFolderName(''); }, 'Create Folder', (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <div className="flex gap-2">
              <button onClick={() => { setShowFolderModal(false); setNewFolderName(''); }} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
              <button onClick={handleCreateFolder} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Create</button>
            </div>
          </div>
        ))}

        {renderModal(showRenameModal, () => { setShowRenameModal(false); setSelectedDoc(null); setNewFileName(''); }, 'Rename', (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="New name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
            <div className="flex gap-2">
              <button onClick={() => { setShowRenameModal(false); setSelectedDoc(null); setNewFileName(''); }} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>Cancel</button>
              <button onClick={handleRename} className="flex-1 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600">Save</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default DocumentsPage;