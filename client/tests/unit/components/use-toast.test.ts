import { reducer } from '@/components/ui/use-toast'

describe('toast reducer', () => {
  const sampleToast = {
    id: '1',
    title: 'Test Toast',
    open: true
  }

  it('ADD_TOAST', () => {
    const state = { toasts: [] }

    const result = reducer(state, {
      type: 'ADD_TOAST',
      toast: sampleToast
    })

    expect(result.toasts).toHaveLength(1)
    expect(result.toasts[0].id).toBe('1')
  })

  it('UPDATE_TOAST', () => {
    const state = {
      toasts: [sampleToast]
    }

    const result = reducer(state, {
      type: 'UPDATE_TOAST',
      toast: {
        id: '1',
        title: 'Updated'
      }
    })

    expect(result.toasts[0].title).toBe('Updated')
  })

  it('DISMISS_TOAST single', () => {
    const state = {
      toasts: [sampleToast]
    }

    const result = reducer(state, {
      type: 'DISMISS_TOAST',
      toastId: '1'
    })

    expect(result.toasts[0].open).toBe(false)
  })

  it('DISMISS_TOAST all', () => {
    const state = {
      toasts: [
        sampleToast,
        {
          id: '2',
          title: 'Toast 2',
          open: true
        }
      ]
    }

    const result = reducer(state, {
      type: 'DISMISS_TOAST'
    })

    expect(result.toasts.every((t) => t.open === false)).toBe(true)
  })

  it('REMOVE_TOAST by id', () => {
    const state = {
      toasts: [sampleToast]
    }

    const result = reducer(state, {
      type: 'REMOVE_TOAST',
      toastId: '1'
    })

    expect(result.toasts).toHaveLength(0)
  })

  it('REMOVE_TOAST all', () => {
    const state = {
      toasts: [
        sampleToast,
        {
          id: '2',
          title: 'Toast 2',
          open: true
        }
      ]
    }

    const result = reducer(state, {
      type: 'REMOVE_TOAST'
    })

    expect(result.toasts).toHaveLength(0)
  })
})