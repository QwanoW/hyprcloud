<?php

return [
    'title' => 'Cloud Storage User Guide',
    'description' => 'Learn how to effectively use all features of your cloud storage.',
    'steps' => 'Steps',

    // File Management Section
    'file_management' => [
        'title' => 'File Management',
        'description' => 'Basic operations for working with files and folders.',
        
        'upload' => [
            'title' => 'Upload Files',
            'description' => 'Add new files to your cloud storage.',
            'step1' => 'Click the "Upload" button in the top toolbar',
            'step2' => 'Select files from your device or drag and drop them into the interface',
            'step3' => 'Wait for the upload to complete - you\'ll see a message'
        ],
        
        'selection' => [
            'title' => 'Select Files',
            'description' => 'Choose files for bulk operations.',
            'step1' => 'Click on a file to select it (single selection)',
            'step2' => 'Hold Ctrl/Cmd and click to select multiple files',
            'step3' => 'Drag with mouse to select multiple files in an area'
        ],
        
        'folders' => [
            'title' => 'Create Folders',
            'description' => 'Organize your files with folders.',
            'step1' => 'Click the "Create" dropdown in the toolbar',
            'step2' => 'Select "Create Folder" from the menu',
            'step3' => 'Enter a name for your folder and confirm'
        ]
    ],

    // Collections Section
    'collections' => [
        'title' => 'Collections',
        'description' => 'Organize files into themed collections for better management.',
        
        'create' => [
            'title' => 'Create Collection',
            'description' => 'Group related files together.',
            'step1' => 'Click the "Create" dropdown in the toolbar',
            'step2' => 'Select "Create Collection" from the menu',
            'step3' => 'Choose a name and icon for your collection'
        ],
        
        'organize' => [
            'title' => 'Organize Collections',
            'description' => 'Manage files within collections.',
            'step1' => 'Navigate to a collection from the sidebar',
            'step2' => 'Add files by moving them or uploading directly to the collection'
        ]
    ],

    // File Actions Section
    'file_actions' => [
        'title' => 'File Actions',
        'description' => 'Available operations you can perform on your files.',
        
        'sharing' => [
            'title' => 'Share Files',
            'description' => 'Create shareable links for your files.',
            'step1' => 'Select a file and click the "Share" button',
            'step2' => 'Configure sharing settings (password, expiration, download permissions)',
            'step3' => 'Copy the generated link to share with others'
        ],
        
        'download' => [
            'title' => 'Download Files',
            'description' => 'Save files to your device.',
            'step1' => 'Select one or more files',
            'step2' => 'Right-click and choose "Download Zip" or double-click on a file to open a dialog with a slider, where there will be a download button at the top'
        ],
        
        'move' => [
            'title' => 'Move Files',
            'description' => 'Relocate files to different folders or collections.',
            'step1' => 'Select the files you want to move',
            'step2' => 'Right-click and choose "Move" from the context menu',
            'step3' => 'Select the destination folder or collection'
        ],
        
        'rename' => [
            'title' => 'Rename Files',
            'description' => 'Change file and folder names.',
            'step1' => 'Select a single file or folder',
            'step2' => 'Right-click and choose "Rename"'
        ],
        
        'delete' => [
            'title' => 'Delete Files',
            'description' => 'Remove files from your storage.',
            'step1' => 'Select the files you want to delete',
            'step2' => 'Click the "Delete" button'
        ]
    ],

    // Navigation Section
    'navigation' => [
        'title' => 'Navigation',
        'description' => 'Understanding the different sections of your cloud storage.',
        
        'all_files' => [
            'title' => 'All Files',
            'description' => 'View all your files and folders in one place.'
        ],
        
        'gallery' => [
            'title' => 'Gallery',
            'description' => 'Browse your images and media files in a visual grid.'
        ],
        
        'shared' => [
            'title' => 'Shared Files',
            'description' => 'Manage files you\'ve shared with others and view sharing settings.'
        ],
        
        'trash' => [
            'title' => 'Trash',
            'description' => 'Recover deleted files or permanently remove them.'
        ],
        
        'search' => [
            'title' => 'Global Search',
            'description' => 'Find files quickly by name or content across your entire storage.'
        ],
        
        'analytics' => [
            'title' => 'Analytics',
            'description' => 'View storage usage statistics and file activity.'
        ]
    ],

    // Advanced Features Section
    'advanced' => [
        'title' => 'Advanced Features',
        'description' => 'Power user features for enhanced productivity.',
        
        'bulk_download' => [
            'title' => 'Bulk Download',
            'description' => 'Download multiple files as a ZIP archive.',
            'step1' => 'Select multiple files or folders',
            'step2' => 'Right-click and choose "Download as ZIP"'
        ],
        
        'restore' => [
            'title' => 'Restore Files',
            'description' => 'Recover files from the trash.',
            'step1' => 'Navigate to the Trash section',
            'step2' => 'Select files and click "Restore" to return them to their original location'
        ],
        
        'preview' => [
            'title' => 'File Preview',
            'description' => 'View file contents without downloading.',
            'step1' => 'Double-click on a supported file type (images, documents, videos)',
            'step2' => 'Use the preview modal to view content and navigate between files'
        ]
    ]
];