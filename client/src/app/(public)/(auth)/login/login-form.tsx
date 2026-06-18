'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/queries/useAuth'
import { toast } from '@/components/ui/use-toast'
import { handleErrorApi } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from '@/components/app-provider'
import { socketInstance } from '@/lib/socket'

export default function LoginForm() {
  const { setRole, setSocket } = useAppContext()
  const loginMutation = useLoginMutation()
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const searchParams = useSearchParams()
  const clearTokens = searchParams.get('clearTokens')
  useEffect(() => {
    if (clearTokens === 'true') {
      setRole(undefined)
    }
  }, [clearTokens, setRole])

  const onSubmit = async (data: LoginBodyType) => {
    try {
      const result = await loginMutation.mutateAsync(data)
      toast({ description: result.payload.message })
      setRole(result.payload.data.account.role)
      router.push('/manage/dashboard')
      setSocket(socketInstance(result.payload.data.accessToken))
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Please sign in to your account to manage the restaurant</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.log(err)
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="name@example.com" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Sign in with Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}