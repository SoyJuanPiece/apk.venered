import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import supabase from '../supabase/client'; // Importar el cliente directamente
import { AuthService } from '../services/auth';
import {
  LoginCredentials,
  SignUpData,
  AuthSession,
  AuthContextType,
} from '../types';

// El estado ahora es más simple: solo la sesión y el estado de carga.
type AuthState = {
  session: AuthSession | null;
  isLoading: boolean;
};

type AuthAction =
  | { type: 'SET_SESSION'; payload: AuthSession | null }
  | { type: 'SET_LOADING'; payload: boolean };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
        isLoading: false, // El estado de la sesión ya se conoce, la carga ha terminado.
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    session: null,
    isLoading: true, // La app siempre inicia en estado de carga.
  });

  // Este useEffect es el corazón de la nueva arquitectura.
  // Se suscribe a los cambios de autenticación directamente desde Supabase.
  useEffect(() => {
    // 1. Inmediatamente al cargar, pedimos la sesión actual. Esto reemplaza `restoreToken`.
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_SESSION', payload: session });
    });

    // 2. Creamos un "escuchador" que reaccionará a futuros inicios y cierres de sesión.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch({ type: 'SET_SESSION', payload: session });
      }
    );

    // 3. Es crucial cancelar la suscripción cuando el componente se desmonte para evitar fugas de memoria.
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const authContext: AuthContextType = {
    // Estado expuesto a los componentes hijos
    user: state.session?.user ?? null,
    session: state.session,
    isLoading: state.isLoading,
    isSignout: !state.session && !state.isLoading,

    // Métodos que llaman al AuthService. Ya no necesitan despachar acciones.
    signIn: useCallback(async (credentials: LoginCredentials) => {
      try {
        await AuthService.signIn(credentials);
        // El listener `onAuthStateChange` se encargará de actualizar el estado.
      } catch (error: any) {
        throw error; // Lanzamos el error para que la UI pueda mostrarlo.
      }
    }, []),

    signUp: useCallback(async (data: SignUpData) => {
      try {
        await AuthService.signUp(data);
        // En el modo simulado, el signUp no inicia sesión, así que lo hacemos manualmente.
        await AuthService.signIn({ email: data.email, password: data.password });
      } catch (error: any) {
        throw error;
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        await AuthService.signOut();
        // El listener `onAuthStateChange` también se encargará de esto.
      } catch (error: any) {
        throw error;
      }
    }, []),

    // La función `restoreToken` ya no es necesaria.
    restoreToken: async () => {},
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
