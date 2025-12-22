// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import styles from '../styles/dashboardStyles';
// import authService from '../services/authService';
// import storageUtil from '../services/storageUtil';

// export default function ForgotPasswordFlow({ navigation }: any) {
//   const [step, setStep] = useState<'request' | 'verify' | 'done'>('request');
//   const [mobile, setMobile] = useState('');
//   const [requestId, setRequestId] = useState('');
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);

//   const requestOtp = async () => {
//     if (!mobile || !String(mobile).trim()) return Alert.alert('Error', 'Enter mobile number');
//     setLoading(true);
//     try {
//        const resp: any = await authService.requestOtp(mobile, 'whatsapp');
//       if (resp && resp.success) {
//         const rid = resp.requestId ?? resp.data?.requestId ?? resp.result?.requestId ?? '';
//         setRequestId(rid);
//         setStep('verify');
//       } else {
//         Alert.alert('Error', resp?.message || 'Failed to request OTP');
//       }
//     } catch (e: any) {
//       if (__DEV__) console.warn('[ForgotPasswordFlow] requestOtp error', e);
//       Alert.alert('Error', e?.message || 'Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verify = async () => {
//     if (!otp || !requestId) return Alert.alert('Error', 'Enter OTP');
//     setLoading(true);
//     try {
//       const resp: any = await authService.verifyOtp(requestId, otp);
//       if (resp && resp.success) {
//         const token = resp.token ?? resp.data?.token ?? resp.result?.token ?? null;
//         const user = resp.user ?? resp.data?.user ?? resp.result ?? null;

//         try {
//           if (token) {
//             await storageUtil.saveAuthData(token, user ?? {});
//           }
//         } catch (sErr) {
//           if (__DEV__) console.warn('[ForgotPasswordFlow] saving auth data failed', sErr);
//         }

//         Alert.alert('Success', 'Verified — you are logged in.');
//         setStep('done');
//         navigation.reset?.({ index: 0, routes: [{ name: 'Dashboard' }] });
//       } else {
//         Alert.alert('Error', resp?.message || 'Invalid OTP');
//       }
//     } catch (e: any) {
//       if (__DEV__) console.warn('[ForgotPasswordFlow] verify error', e);
//       Alert.alert('Error', e?.message || 'Network/Server error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ padding: 16 }}>
//       {step === 'request' && (
//         <>
//           <Text style={{ fontSize: 18, fontWeight: '700' }}>Login with Mobile</Text>
//           <TextInput
//             style={(styles as any).input}
//             placeholder="Mobile (with country code, e.g. +91...)"
//             value={mobile}
//             onChangeText={setMobile}
//             keyboardType="phone-pad"
//             autoCapitalize="none"
//           />
//           <TouchableOpacity
//             onPress={requestOtp}
//             style={[(styles as any).btnPrimary, loading ? { opacity: 0.6 } : undefined]}
//             disabled={loading}
//           >
//             <Text style={{ color: '#fff' }}>{loading ? 'Sending...' : 'Send OTP via WhatsApp'}</Text>
//           </TouchableOpacity>

//           <View style={{ marginTop: 12 }}>
//             <TouchableOpacity onPress={() => navigation.navigate?.('ForgotByEmail')}>
//               <Text style={{ color: '#2563EB' }}>Or reset via email</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}

//       {step === 'verify' && (
//         <>
//           <Text style={{ fontSize: 18, fontWeight: '700' }}>Enter OTP</Text>
//           <TextInput
//             style={(styles as any).input}
//             placeholder="6-digit OTP"
//             value={otp}
//             onChangeText={setOtp}
//             keyboardType="number-pad"
//             maxLength={8}
//             autoCapitalize="none"
//           />
//           <TouchableOpacity
//             onPress={verify}
//             style={[(styles as any).btnPrimary, loading ? { opacity: 0.6 } : undefined]}
//             disabled={loading}
//           >
//             <Text style={{ color: '#fff' }}>{loading ? 'Verifying...' : 'Verify'}</Text>
//           </TouchableOpacity>

//           <View style={{ marginTop: 12 }}>
//             <TouchableOpacity onPress={() => { setStep('request'); setOtp(''); }}>
//               <Text style={{ color: '#6B7280' }}>Edit mobile number</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}

//       {step === 'done' && (
//         <View>
//           <Text>Done — you are logged in</Text>
//           <TouchableOpacity
//             onPress={() => navigation.navigate?.('Dashboard')}
//             style={(styles as any).btnPrimary}
//           >
//             <Text style={{ color: '#fff' }}>Go to app</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }