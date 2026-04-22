import { useState } from 'react'

interface DeleteModalProps {
    id: string
    title?: string
    description?: string
    onConfirm: () => Promise<void>  // async
}

export default function DeleteModal({ id, title, description, onConfirm }: DeleteModalProps) {
    const [loading, setLoading] = useState(false)

    const closeModal = () => {
        const modal = document.getElementById(id) as HTMLDialogElement
        modal?.close()
    }

    const handleConfirm = async () => {
        setLoading(true)
        await onConfirm()
        setLoading(false)
        closeModal()
    }

    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title ?? 'Delete Confirmation'}</h3>
                <p className="py-4 text-base-content/70">
                    {description ?? 'This action cannot be undone.'}
                </p>
                <div className="modal-action">
                    <button className="btn" onClick={closeModal} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && <span className="loading loading-spinner loading-sm" />}
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button disabled={loading}>close</button>
            </form>
        </dialog>
    )
}