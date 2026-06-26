import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from 'boot/supabase'
import { useAuthStore } from './useAuthStore'

export const useClubStore = defineStore('club', () => {
  const currentClub = ref(null)
  const userClubs = ref([])
  const loading = ref(false)

  async function fetchUserClubs() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    const { data, error } = await supabase
      .from('club_members')
      .select('role, is_owner, can_manage_finances, can_manage_teams, can_manage_matches, clubs(id, name, invite_code)')
      .eq('profile_id', authStore.user.id)

    if (!error && data) {
      userClubs.value = data.map(item => ({
        id: item.clubs.id,
        name: item.clubs.name,
        invite_code: item.clubs.invite_code, // <-- CARREGA O CÓDIGO AQUI
        role: item.role,
        is_owner: item.is_owner,
        can_manage_finances: item.can_manage_finances,
        can_manage_teams: item.can_manage_teams,
        can_manage_matches: item.can_manage_matches
      }))
    }
    loading.value = false
  }

  function setClub(club) {
    currentClub.value = club
    if (club) {
      localStorage.setItem('last_club_id', club.id)
    } else {
      localStorage.removeItem('last_club_id')
    }
  }

  return { currentClub, userClubs, loading, fetchUserClubs, setClub }
})