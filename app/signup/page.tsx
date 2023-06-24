'use client'
import { Button } from '@/components/atoms/button'
import { Card, CardContent, CardHeader } from '@/components/atoms/card'
import { IslingLogo } from '@/components/atoms/logo'
import { Input } from '@/components/atoms/input'
import Link from 'next/link'
import useSignUp from '@/lib/account/useSignUp'
import validator from 'validator'

export default function Page() {
  const { handleSignUp, isLoading, signUpForm } = useSignUp()

  return (
    <div className="mt-24 lg:-mt-16">
      <div className="mb-2 opacity-60">
        <Link href="/">
          <IslingLogo />
        </Link>
      </div>
      <Card className="w-screen px-2 h-screen bg-transparent border-0 lg:w-[28rem] lg:h-auto lg:bg-primary lg:bg-opacity-10 lg:border lg:mt-0">
        <CardHeader className="mt-4">
          <div className="flex justify-center text-2xl font-semibold">
            Create an Isling Account
          </div>
        </CardHeader>
        <CardContent className="mt-2">
          <form
            className="space-2"
            onSubmit={signUpForm.handleSubmit(handleSignUp)}
          >
            <Input
              label="Email"
              type="text"
              autoComplete="username"
              required
              isError={!!signUpForm.formState.errors.email}
              hint={signUpForm.formState.errors.email?.message}
              autoFocus
              {...signUpForm.register('email', {
                required: 'Email is required',
                validate: {
                  isEmail: (v) =>
                    validator.isEmail(v) || 'Email address is incorrect format',
                },
              })}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              isError={Boolean(signUpForm.formState.errors.password)}
              hint={signUpForm.formState.errors.password?.message}
              {...signUpForm.register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password length must greater than 8',
                },
                validate: (v) =>
                  validator.isAscii(v) ||
                  'Password should contain letters, digits and special characters',
                deps: 'confirmPassword',
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              required
              isError={Boolean(signUpForm.formState.errors.confirmPassword)}
              hint={signUpForm.formState.errors.confirmPassword?.message}
              {...signUpForm.register('confirmPassword', {
                validate: (value, formValues) =>
                  value === formValues.password ||
                  'Password and Confirm Password does not match',
              })}
            />
            <div className="mt-6 flex justify-center">
              <Button
                variant="highlight"
                type="submit"
                className="w-36"
                disabled={isLoading}
              >
                Create
              </Button>
            </div>
          </form>
          <div className="flex justify-center items-center mt-4 mb-4 text-secondary/80">
            <div className="text-sm">Already have an account?</div>
            <Button variant="link" size="sm">
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
