import { Prompt } from '@/types/prompt';

export const exportToCSV = (prompts: Prompt[]): void => {
  const headers = [
    'Title',
    'Content',
    'Category',
    'Tags',
    'Created At',
    'Updated At',
    'Usage Count',
    'Rating',
    'Source URL',
    'AI Model'
  ];

  const csvContent = [
    headers.join(','),
    ...prompts.map(prompt => [
      `"${prompt.title.replace(/"/g, '""')}"`,
      `"${prompt.content.replace(/"/g, '""')}"`,
      `"${prompt.category || ''}"`,
      `"${prompt.tags.join('; ')}"`,
      prompt.createdAt.toISOString(),
      prompt.updatedAt.toISOString(),
      prompt.usageCount,
      prompt.rating || '',
      `"${prompt.sourceUrl || ''}"`,
      `"${prompt.aiModel || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `prompts-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (prompts: Prompt[]): void => {
  const jsonContent = JSON.stringify(prompts, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `prompts-export-${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};