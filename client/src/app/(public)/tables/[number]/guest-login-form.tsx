'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemas/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { handleErrorApi } from '@/lib/utils'
import { useAppContext } from '@/components/app-provider'
import { socketInstance } from '@/lib/socket'

export default function GuestLoginForm() {
  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')

  const { setRole, setSocket } = useAppContext()

  const guestLoginMutation = useGuestLoginMutation()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token || '',
      tableNumber,
    },
  })

  const router = useRouter()
  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [router, token])

  const onSubmit = async (values: GuestLoginBodyType) => {
    if (guestLoginMutation.isPending) return

    try {
      const result = await guestLoginMutation.mutateAsync(values)
      setRole(result.payload.data.guest.role)
      setSocket(socketInstance(result.payload.data.accessToken))
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome to BigBoy</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e)
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="Enter your name to start ordering" 
                        required 
                        {...field} 
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Start Ordering
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}