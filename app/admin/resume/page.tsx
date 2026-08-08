import { resumeFileService } from '@/lib/services/content-services';
import { ResumeManager } from '@/components/admin/resume-manager';

export default async function AdminResumePage() {
  const files = await resumeFileService.getAll();
  return <ResumeManager initialFiles={files} />;
}
