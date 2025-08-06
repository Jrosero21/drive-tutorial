'use client'

import { useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Search, Upload, Grid3X3, List, MoreVertical, Folder, FileText, Image, FileSpreadsheet, FileVideo, Download, Share, Trash2, Star, Clock, HardDrive, Settings, Plus, FolderPlus } from 'lucide-react'

// Mock data structure
const mockData = {
  '/': {
    name: 'My Drive',
    items: [
      { id: '1', name: 'Documents', type: 'folder', size: null, modified: '2024-01-15', starred: false },
      { id: '2', name: 'Photos', type: 'folder', size: null, modified: '2024-01-10', starred: true },
      { id: '3', name: 'Projects', type: 'folder', size: null, modified: '2024-01-20', starred: false },
      { id: '4', name: 'Resume.pdf', type: 'file', size: '2.4 MB', modified: '2024-01-18', starred: true, url: '/files/resume.pdf' },
      { id: '5', name: 'Vacation.jpg', type: 'file', size: '5.2 MB', modified: '2024-01-12', starred: false, url: '/files/vacation.jpg' },
      { id: '6', name: 'Budget.xlsx', type: 'file', size: '1.8 MB', modified: '2024-01-16', starred: false, url: '/files/budget.xlsx' },
    ]
  },
  '/Documents': {
    name: 'Documents',
    items: [
      { id: '7', name: 'Work', type: 'folder', size: null, modified: '2024-01-14', starred: false },
      { id: '8', name: 'Personal', type: 'folder', size: null, modified: '2024-01-13', starred: false },
      { id: '9', name: 'Meeting Notes.docx', type: 'file', size: '856 KB', modified: '2024-01-15', starred: false, url: '/files/meeting-notes.docx' },
      { id: '10', name: 'Contract.pdf', type: 'file', size: '1.2 MB', modified: '2024-01-14', starred: true, url: '/files/contract.pdf' },
    ]
  },
  '/Photos': {
    name: 'Photos',
    items: [
      { id: '11', name: '2024', type: 'folder', size: null, modified: '2024-01-10', starred: false },
      { id: '12', name: '2023', type: 'folder', size: null, modified: '2023-12-31', starred: false },
      { id: '13', name: 'Profile.png', type: 'file', size: '3.1 MB', modified: '2024-01-08', starred: false, url: '/files/profile.png' },
      { id: '14', name: 'Screenshot.png', type: 'file', size: '2.7 MB', modified: '2024-01-09', starred: false, url: '/files/screenshot.png' },
    ]
  },
  '/Projects': {
    name: 'Projects',
    items: [
      { id: '15', name: 'Website Redesign', type: 'folder', size: null, modified: '2024-01-20', starred: true },
      { id: '16', name: 'Mobile App', type: 'folder', size: null, modified: '2024-01-19', starred: false },
      { id: '17', name: 'Presentation.pptx', type: 'file', size: '4.5 MB', modified: '2024-01-18', starred: false, url: '/files/presentation.pptx' },
      { id: '18', name: 'Demo Video.mp4', type: 'file', size: '25.3 MB', modified: '2024-01-17', starred: false, url: '/files/demo-video.mp4' },
    ]
  }
}

const getFileIcon = (type: string, fileName: string) => {
  if (type === 'folder') return <Folder className="w-5 h-5 text-blue-500" />
  
  const extension = fileName.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="w-5 h-5 text-red-500" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <Image className="w-5 h-5 text-green-500" />
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <FileVideo className="w-5 h-5 text-purple-500" />
    default:
      return <FileText className="w-5 h-5 text-gray-500" />
  }
}

export default function GoogleDriveClone() {
  const [currentPath, setCurrentPath] = useState('/')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchQuery, setSearchQuery] = useState('')

  const currentFolder = mockData[currentPath as keyof typeof mockData]
  const pathSegments = currentPath.split('/').filter(Boolean)

  const filteredItems = currentFolder?.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleItemClick = (item: any) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`
      setCurrentPath(newPath)
    } else if (item.url) {
      // In a real app, this would open/download the file
      window.open(item.url, '_blank')
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentPath('/')
    } else {
      const newPath = '/' + pathSegments.slice(0, index + 1).join('/')
      setCurrentPath(newPath)
    }
  }

  const handleUpload = () => {
    // Mock upload functionality
    alert('Upload functionality would be implemented here!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Drive</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="w-4 h-4 mr-2" />
                  New Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant={currentPath === '/' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setCurrentPath('/')}
            >
              <HardDrive className="w-4 h-4 mr-2" />
              My Drive
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Star className="w-4 h-4 mr-2" />
              Starred
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Trash
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
          
          <div className="p-4 border-t border-gray-200 mt-8">
            <div className="text-sm text-gray-600 mb-2">Storage</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">6.8 GB of 15 GB used</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Breadcrumb and View Controls */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href="#" 
                      onClick={() => handleBreadcrumbClick(-1)}
                      className="cursor-pointer hover:text-blue-600 font-medium"
                    >
                      My Drive
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathSegments.map((segment, index) => (
                    <div key={index} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {index === pathSegments.length - 1 ? (
                          <BreadcrumbPage className="font-semibold text-gray-900">{segment}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink 
                            href="#" 
                            onClick={() => handleBreadcrumbClick(index)}
                            className="cursor-pointer hover:text-blue-600 font-medium"
                          >
                            {segment}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* File Grid/List */}
          {viewMode === 'list' && (
            <div className="flex items-center space-x-4 p-3 border-b border-gray-200 text-sm font-medium text-gray-600 mb-2">
              <div className="w-5"></div> {/* Icon space */}
              <div className="flex-1 min-w-0">Name</div>
              <div className="w-24 text-right">Modified</div>
              <div className="w-20 text-right">Size</div>
              <div className="w-10"></div> {/* Actions space */}
            </div>
          )}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-2">
                      {getFileIcon(item.type, item.name)}
                      <div className="text-sm font-medium text-center truncate w-full">
                        {item.name}
                      </div>
                      {item.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group border-l-4 border-transparent hover:border-blue-500 transition-all"
                  onClick={() => handleItemClick(item)}
                >
                  {getFileIcon(item.type, item.name)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      {item.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 w-24 text-right">{item.modified}</div>
                  <div className="text-sm text-gray-500 w-20 text-right">{item.size || '--'}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 w-10">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No files found</div>
              <div className="text-gray-400">Try adjusting your search or upload some files</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
