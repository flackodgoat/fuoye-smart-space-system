const USERS_KEY = 'fuoye_users'

export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUserByMatric = (matricNumber) => {
  return getUsers().find(
    (user) =>
      user.matricNumber.toLowerCase() ===
      matricNumber.toLowerCase()
  )
}

export const findUserByEmail = (email) => {
  return getUsers().find(
    (user) =>
      user.email.toLowerCase() ===
      email.toLowerCase()
  )
}

export const registerUser = (userData) => {
  const users = getUsers()

  const matricExists = users.some(
    (u) => u.matricNumber === userData.matricNumber
  )

  const emailExists = users.some(
    (u) => u.email === userData.email
  )

  if (matricExists) {
    return {
      success: false,
      message: 'Matric number already exists',
    }
  }

  if (emailExists) {
    return {
      success: false,
      message: 'Email already exists',
    }
  }

  const newUser = {
    id: Date.now(),
    ...userData,
    role: 'student',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)

  saveUsers(users)

  localStorage.setItem(
    'fuoye_user',
    JSON.stringify(newUser)
  )

  return {
    success: true,
    user: newUser,
  }
}

export const validateLogin = (
  matricNumber,
  password
) => {
  const users = getUsers()

  return users.find(
    (user) =>
      user.matricNumber.toLowerCase() ===
        matricNumber.toLowerCase() &&
      user.password === password
  )
}