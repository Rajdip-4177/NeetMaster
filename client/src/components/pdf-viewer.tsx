import { useState } from 'react';
import { FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfViewerProps {
  title: string;
  pageCount: number;
  type: 'notes' | 'ncert';
}

export default function PdfViewer({ title, pageCount, type }: PdfViewerProps) {
  const [expanded, setExpanded] = useState(false);

  // In a real implementation, this would use react-pdf to display an actual PDF
  // For now, we'll just simulate the viewer

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {!expanded ? (
        <div className="text-center">
          {type === 'notes' ? (
            <FileText className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
          ) : (
            <BookOpen className="h-16 w-16 text-gray-400 mb-4 mx-auto" />
          )}
          <p className="text-gray-500 text-center mb-4">{title}</p>
          <p className="text-sm text-gray-400 text-center mb-6">
            PDF Document - {pageCount} pages
          </p>
          <Button 
            onClick={() => setExpanded(true)}
            className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90"
          >
            Open PDF Viewer
          </Button>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">{title}</h4>
            <Button 
              variant="outline"
              onClick={() => setExpanded(false)}
              size="sm"
            >
              Close
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 min-h-[500px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>PDF viewer would be displayed here</p>
              <p className="text-sm mt-2">
                In a real implementation, this would use a library like react-pdf to display the actual PDF.
              </p>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page 1 of {pageCount}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
