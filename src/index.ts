// CRITICAL: Unistyles MUST configure before expo-router loads any route modules
import './styles/unistyles';

// Now safe to load expo-router (which will discover and load all route files)
import 'expo-router/entry';
