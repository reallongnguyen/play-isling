'use client'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
  LoadingHeader,
  LoadingScreen,
} from '@/components/atoms/loading-skeleton'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/atoms/select'
import { Separator } from '@/components/atoms/separator'
import UserCard from '@/components/organisms/user-card'
import HomeHeader from '@/components/templates/headers/HomeHeader'
import useUpsertProfile, {
  validateDateOfBirth,
} from '@/lib/account/useUpsertProfile'
import validator from 'validator'

export default function EditProfilePage() {
  const { userProfile, handleUpsertProfile, editProfileForm, resetForm } =
    useUpsertProfile()

  if (!userProfile) {
    return (
      <>
        <LoadingHeader />
        <LoadingScreen />
      </>
    )
  }

  return (
    <>
      <header className="fixed h-12 lg:h-14 top-0 left-0 px-2 lg:px-6 w-full bg-primary z-40">
        <HomeHeader />
      </header>
      <div className="h-12" />
      <div className="container-md">
        <div className="mt-8">
          <UserCard profile={userProfile} />
          <Separator className="mt-6" />
        </div>
        <div className="mt-6 text-xl">Edit your profile</div>
        <form
          className="mt-8 space-y-4"
          onSubmit={editProfileForm.handleSubmit(handleUpsertProfile)}
        >
          <div className="lg:flex lg:space-x-4 -mb-4">
            <Input
              required
              type="text"
              className="w-56"
              label="First name"
              isError={!!editProfileForm.formState.errors.firstName}
              hint={editProfileForm.formState.errors.firstName?.message}
              {...editProfileForm.register('firstName', {
                required: 'First name is required',
              })}
            />
            <Input
              className="w-56"
              type="text"
              label="Last name"
              isError={!!editProfileForm.formState.errors.lastName}
              hint={editProfileForm.formState.errors.lastName?.message}
              {...editProfileForm.register('lastName')}
            />
          </div>
          <div className="space-y-1 !-mb-4">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={editProfileForm.watch('gender')}
              onValueChange={(v) => editProfileForm.setValue('gender', v)}
              {...editProfileForm.register('gender', {
                required: 'Gender is required',
              })}
            >
              <SelectTrigger
                className={`
                  w-56
                  ${
                    editProfileForm.formState.errors.gender
                      ? 'border-[#ff4d4f]'
                      : 'border-input'
                  }
                `}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="unknown">Rather not say</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="text-sm min-h-[1.25rem] pb-1 flex items-start ml-1 leading-none font-light text-[#ff4d4f]">
              {editProfileForm.formState.errors.gender?.message}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="yearOfBirth">Date of birth</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Year"
                type="text"
                className="w-20 text-center"
                isError={!!editProfileForm.formState.errors.yearOfBirth}
                {...editProfileForm.register('yearOfBirth', {
                  required: true,
                  maxLength: 4,
                  min: 1900,
                  validate: {
                    validateTime: validateDateOfBirth,
                    validateNumber: (v) => validator.isNumeric(v),
                  },
                  deps: ['monthOfBirth', 'dayOfBirth'],
                })}
              />
              <Input
                placeholder="Month"
                type="text"
                className="w-20 text-center"
                isError={!!editProfileForm.formState.errors.monthOfBirth}
                {...editProfileForm.register('monthOfBirth', {
                  required: true,
                  maxLength: 2,
                  min: 1,
                  max: 12,
                  validate: {
                    validateTime: validateDateOfBirth,
                    validateNumber: (v) => validator.isNumeric(v),
                  },
                  setValueAs: (v) => v.padStart(2, '0'),
                  deps: ['yearOfBirth', 'dayOfBirth'],
                })}
              />
              <Input
                placeholder="Day"
                type="text"
                className="w-20 text-center"
                isError={!!editProfileForm.formState.errors.dayOfBirth}
                {...editProfileForm.register('dayOfBirth', {
                  required: true,
                  maxLength: 2,
                  min: 1,
                  max: 31,
                  validate: {
                    validateTime: validateDateOfBirth,
                    validateNumber: (v) => validator.isNumeric(v),
                  },
                  setValueAs: (v) => v.padStart(2, '0'),
                  deps: ['yearOfBirth', 'monthOfBirth'],
                })}
              />
            </div>
            <div
              className={`
                text-sm min-h-[1.25rem] pb-1 !-mt-5 flex items-start ml-1 leading-none font-light
                ${
                  editProfileForm.formState.errors.dayOfBirth
                    ? 'text-[#ff4d4f]'
                    : 'text-inherit brightness-75'
                }
              `}
            >
              {editProfileForm.formState.errors.dayOfBirth?.message ||
                'Year-Month-Day format'}
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="highlight" type="submit" className="w-32 mt-4">
              Save
            </Button>
            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault()
                resetForm()
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
      <div className="h-28" />
    </>
  )
}
