'use client'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader } from '@/components/atoms/card'
import { IslingLogo } from '@/components/atoms/logo'
import { Input } from '@/components/atoms/input'
import useSignIn from '@/lib/account/useSignIn'
import Link from 'next/link'
import validator from 'validator'

export default function Page() {
  const { handleSignIn, isLoading, signInForm } = useSignIn()

  return (
    <div className="mt-24 lg:-mt-16">
      <div className="mb-2 opacity-60">
        <Link href="/">
          <IslingLogo />
        </Link>
      </div>
      <Card className="w-screen px-2 h-screen bg-transparent border-0 lg:w-[28rem] lg:h-auto lg:bg-primary lg:bg-opacity-10 lg:border lg:mt-0">
        <CardHeader className="mt-4">
          <div className="flex justify-center text-3xl font-semibold">
            Sign in
          </div>
        </CardHeader>
        <CardContent className="mt-2">
          <form
            className="space-2"
            onSubmit={signInForm.handleSubmit(handleSignIn)}
          >
            <Input
              label="Email"
              type="email"
              required
              autoComplete="username"
              isError={!!signInForm.formState.errors.email}
              hint={signInForm.formState.errors.email?.message}
              autoFocus
              {...signInForm.register('email', {
                required: 'Email is required',
                validate: (v) =>
                  validator.isEmail(v) || 'Email address is incorrect format',
              })}
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              isError={!!signInForm.formState.errors.password}
              hint={signInForm.formState.errors.password?.message}
              {...signInForm.register('password', {
                required: 'Password is required',
              })}
            />
            <div className="mt-6 mb-4 flex justify-center">
              <Button
                variant="highlight"
                type="submit"
                className="w-36"
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
            <div className="flex items-center justify-center mb-4 text-secondary/80">
              <div className="text-sm">Does not have an account?</div>
              <Button variant="link" size="sm">
                <Link href="/signup">Create Free Account</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
