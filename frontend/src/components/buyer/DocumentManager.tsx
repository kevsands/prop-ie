import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

// Document API functions
const documentAPI = {
  // Mock function to upload document
  uploadDocument: async (formData: FormData) => {
    // This will be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: 'doc-' + Math.random().toString(36).substr(2, 9),
            filename: formData.get('file')?.toString().split('\\').pop(),
            type: formData.get('documentType'),
            status: 'pending'
          }
        });
      }, 1500);
    });
  },
  
  // Mock function to get documents for a purchase
  getDocuments: async (purchaseId: string) => {
    // This will be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 'doc-1',
              type: 'id',
              filename: 'passport.pdf',
              path: '/documents/passport.pdf',
              uploadDate: new Date().toISOString(),
              status: 'pending'
            },
            {
              id: 'doc-2',
              type: 'address',
              filename: 'utility_bill.pdf',
              path: '/documents/utility_bill.pdf',
              uploadDate: new Date(Date.now() - 86400000).toISOString(),
              status: 'approved'
            }
          ]
        });
      }, 1000);
    });
  }
};

interface Document {
  id: string;
  type: string;
  filename: string;
  path: string;
  uploadDate: string;
  status: string;
  notes?: string;
}

const DocumentManager: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Purchase ID
  const { user } = useAuth();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  
  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await documentAPI.getDocuments(id as string);
        
        if (response.success) {
          setDocuments(response.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch documents');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [id, uploadSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(e.target.value);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    if (!documentType) {
      setUploadError('Please select a document type');
      return;
    }
    
    try {
      setUploadLoading(true);
      setUploadError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('purchaseId', id as string);
      if (notes) formData.append('notes', notes);
      
      // Call API to upload document
      const response = await documentAPI.uploadDocument(formData);
      
      if (response.success) {
        setUploadSuccess(true);
        setUploadMode(false);
        
        // Reset form
        setFile(null);
        setDocumentType('');
        setNotes('');
        
        // Refresh documents list
        const docsResponse = await documentAPI.getDocuments(id as string);
        if (docsResponse.success) {
          setDocuments(docsResponse.data);
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document. Please try again.');
      console.error('Error uploading document:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'id':
        return 'Identification';
      case 'address':
        return 'Proof of Address';
      case 'mortgage':
        return 'Mortgage Approval';
      case 'helpToBuy':
        return 'Help to Buy';
      case 'solicitor':
        return 'Solicitor Details';
      case 'contract':
        return 'Signed Contract';
      case 'compliance':
        return 'Compliance Document';
      case 'other':
        return 'Other Document';
      default:
        return type;
    }
  };

  const getDocumentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Document Management</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Upload and manage documents for your property purchase.
          </p>
        </div>
        {!uploadMode && (
          <button
            type="button"
            onClick={() => setUploadMode(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload New Document
          </button>
        )}
      </div>
      
      <div className="border-t border-gray-200">
        {uploadMode ? (
          <form onSubmit={handleUploadSubmit} className="px-4 py-5 sm:px-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Upload New Document</h4>
            
            {uploadError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{uploadError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                id="documentType"
                name="documentType"
                value={documentType}
                onChange={handleDocumentTypeChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Select a document type</option>
                <option value="id">Identification (Passport/Driver's License)</option>
                <option value="address">Proof of Address</option>
                <option value="mortgage">Mortgage Approval</option>
                <option value="helpToBuy">Help to Buy Approval</option>
                <option value="solicitor">Solicitor Details</option>
                <option value="other">Other Document</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Document File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-500">
                  Selected file: {file.name}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={handleNotesChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any additional information about this document"
                />
              </div>
            </div>
            
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setUploadMode(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading || !file || !documentType}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="px-4 py-5 sm:px-6">
            {uploadSuccess && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Document uploaded successfully! It is now pending review.</p>
                  </div>
                </div>
              </div>
            )}
            
            <h4 className="text-md font-medium text-gray-900 mb-4">Your Documents</h4>
            
            {documents.length > 0 ? (
              <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {documents.map((document) => (
                  <div key={document.id} className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400">
                    <div className="flex-shrink-0">
                      <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={document.path} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">{document.filename}</p>
                        <p className="text-sm text-gray-500 truncate">{getDocumentTypeText(document.type)}</p>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusBadgeClass(document.status)}`}>
                            {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">{new Date(document.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setUploadMode(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Upload Document
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
