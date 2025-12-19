import { useStore } from '@/store/useStore'
import { MRAList } from './MRAList'
import { MRADetail } from './MRADetail'

export function MRATracker() {
  const selectedMRAId = useStore((state) => state.selectedMRAId)

  return (
    <div className="h-full">
      {selectedMRAId ? <MRADetail /> : <MRAList />}
    </div>
  )
}

