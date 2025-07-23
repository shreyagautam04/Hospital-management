import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Handle token persistence
    useEffect(() => {
        if (dToken) {
            localStorage.setItem('dToken', dToken)
        } else {
            localStorage.removeItem('dToken')
        }
    }, [dToken])

    // Handle authentication errors
    const handleAuthError = (error) => {
        if (error.response?.status === 401 || 
            error.response?.data?.message?.toLowerCase().includes('not authorized') ||
            error.response?.data?.message?.toLowerCase().includes('invalid token') ||
            error.response?.data?.message?.toLowerCase().includes('token expired')) {
            
            console.log('Authentication failed, clearing token')
            setDToken('')
            localStorage.removeItem('dToken')
            toast.error('Session expired. Please login again.')
            
            // Force page reload to redirect to login
            setTimeout(() => {
                window.location.reload()
            }, 1500)
            
            return true
        }
        return false
    }

    const getAppointments = async () => {
        try {
            if (!dToken) {
                console.log('No token available for getAppointments')
                return
            }

            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { 
                headers: { dToken } 
            })
            
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('getAppointments error:', error)
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            if (!dToken) {
                toast.error('Authentication required')
                return
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', 
                { appointmentId }, 
                { headers: { dToken } }
            )
            
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('completeAppointment error:', error)
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            if (!dToken) {
                toast.error('Authentication required')
                return
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', 
                { appointmentId }, 
                { headers: { dToken } }
            )
            
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('cancelAppointment error:', error)
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    const getDashData = async () => {
        try {
            if (!dToken) {
                console.log('No token available for getDashData')
                return
            }

            console.log('=== DEBUG INFO ===');
            console.log('Backend URL:', backendUrl);
            console.log('dToken:', dToken);
            console.log('Full URL:', backendUrl + '/api/doctor/dashboard');
            console.log('Headers being sent:', { dToken });

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { 
                headers: { dToken } 
            })
            
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('getDashData error:', error)
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    const getProfileData = async () => {
        try {
            if (!dToken) {
                console.log('No token available for getProfileData')
                return
            }

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { 
                headers: { dToken } 
            })
            
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('getProfileData error:', error)
            if (!handleAuthError(error)) {
                toast.error(error.response?.data?.message || error.message)
            }
        }
    }

    // Add a login function for completeness
    const loginDoctor = async (email, password) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/login', {
                email,
                password
            })
            
            if (data.success) {
                setDToken(data.token)
                toast.success('Login successful')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('Login error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Add logout function
    const logoutDoctor = () => {
        setDToken('')
        setAppointments([])
        setDashData(false)
        setProfileData(false)
        localStorage.removeItem('dToken')
        toast.success('Logged out successfully')
    }

    const value = {
        dToken, setDToken, backendUrl,
        appointments, setAppointments, getAppointments,
        completeAppointment, cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData, getProfileData,
        loginDoctor, logoutDoctor
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider