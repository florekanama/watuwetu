// 'use client'
// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { useRouter } from 'next/navigation'
// import { toast } from 'react-toastify'
// import { supabase } from '@/lib/supabase/client'
// import { DayPicker } from 'react-day-picker'
// import 'react-day-picker/dist/style.css'
// import { fr } from 'date-fns/locale'

// export default function GestionDisponibilites() {
//   const { user, loading: authLoading } = useAuth()
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [lieuxConsultation, setLieuxConsultation] = useState<any[]>([])
//   const [disponibilites, setDisponibilites] = useState<any[]>([])
//   const [conges, setConges] = useState<any[]>([])
//   const [selectedDates, setSelectedDates] = useState<Date[]>([])
//   const [newDispo, setNewDispo] = useState({
//     jour_semaine: 1,
//     heure_debut: '08:00',
//     heure_fin: '17:00',
//     lieu_id: '',
//     autre_lieu: '',
//     actif: true
//   })
//   const [newConge, setNewConge] = useState({
//     date_debut: '',
//     date_fin: '',
//     raison: ''
//   })

//   const joursSemaine = [
//     { id: 1, nom: 'Lundi' },
//     { id: 2, nom: 'Mardi' },
//     { id: 3, nom: 'Mercredi' },
//     { id: 4, nom: 'Jeudi' },
//     { id: 5, nom: 'Vendredi' },
//     { id: 6, nom: 'Samedi' },
//     { id: 7, nom: 'Dimanche' }
//   ]

//   useEffect(() => {
//     if (authLoading) return

//     if (!user) {
//       router.push('/login')
//       return
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true)
        
//         // Vérifier que l'utilisateur est un médecin
//         const { data: medecinData, error: medecinError } = await supabase
//           .from('medecin_infos')
//           .select('id')
//           .eq('user_id', user.id)
//           .single()

//         if (medecinError || !medecinData) {
//           throw new Error('Vous devez être un médecin pour accéder à cette page')
//         }

//         // Charger les lieux de consultation
//         const { data: lieuxData, error: lieuxError } = await supabase
//           .from('lieux_consultation')
//           .select('*')

//         if (lieuxError) throw lieuxError
//         setLieuxConsultation(lieuxData || [])

//         // Charger les disponibilités existantes
//         const { data: dispoData, error: dispoError } = await supabase
//           .from('disponibilites_medecin')
//           .select('*')
//           .eq('medecin_id', medecinData.id)
//           .order('jour_semaine', { ascending: true })

//         if (dispoError) throw dispoError
//         setDisponibilites(dispoData || [])

//         // Charger les congés existants
//         const { data: congesData, error: congesError } = await supabase
//           .from('conges_medecin')
//           .select('*')
//           .eq('medecin_id', medecinData.id)
//           .order('date_debut', { ascending: true })

//         if (congesError) throw congesError
//         setConges(congesData || [])

//       } catch (error: any) {
//         console.error('Erreur lors du chargement:', error)
//         toast.error(`Erreur: ${error.message}`)
//         router.push('/dashboard')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [user, authLoading, router])




//   // Ajoutez cette fonction dans votre composant
// const handleSaveSelectedDates = async () => {
//   if (!user || selectedDates.length === 0) return;

//   try {
//     setSubmitting(true);
    
//     // Vérifier que l'utilisateur est un médecin
//     const { data: medecinData, error: medecinError } = await supabase
//       .from('medecin_infos')
//       .select('id')
//       .eq('user_id', user.id)
//       .single();

//     if (medecinError || !medecinData) {
//       throw new Error('Vous devez être un médecin pour effectuer cette action');
//     }

//     // Convertir les dates sélectionnées en congés
//     // Ici, vous pourriez grouper les dates consécutives pour éviter d'avoir trop d'entrées
//     const congesToAdd = selectedDates.map(date => ({
//       medecin_id: medecinData.id,
//       date_debut: date.toISOString().split('T')[0],
//       date_fin: date.toISOString().split('T')[0],
//       raison: 'Indisponibilité ponctuelle'
//     }));

//     // Enregistrer en base de données
//     const { error } = await supabase
//       .from('conges_medecin')
//       .insert(congesToAdd);

//     if (error) throw error;

//     // Recharger les congés
//     const { data: congesData, error: congesError } = await supabase
//       .from('conges_medecin')
//       .select('*')
//       .eq('medecin_id', medecinData.id)
//       .order('date_debut', { ascending: true });

//     if (congesError) throw congesError;
//     setConges(congesData || []);
    
//     toast.success('Indisponibilités enregistrées avec succès');
//     setSelectedDates([]);
//   } catch (error: any) {
//     console.error('Erreur:', error);
//     toast.error(`Erreur lors de l'enregistrement: ${error.message}`);
//   } finally {
//     setSubmitting(false);
//   }
// };


//   const handleAddDisponibilite = async () => {
//     if (!user) {
//       toast.error('Vous devez être connecté')
//       return
//     }

//     try {
//       setSubmitting(true)

//       // Vérifier que l'utilisateur est un médecin
//       const { data: medecinData, error: medecinError } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (medecinError || !medecinData) {
//         throw new Error('Vous devez être un médecin pour effectuer cette action')
//       }

//       const { error } = await supabase
//         .from('disponibilites_medecin')
//         .insert([{
//           ...newDispo,
//           medecin_id: medecinData.id,
//           heure_debut: `${newDispo.heure_debut}:00`,
//           heure_fin: `${newDispo.heure_fin}:00`
//         }])

//       if (error) throw error

//       // Recharger les disponibilités
//       const { data: dispoData, error: dispoError } = await supabase
//         .from('disponibilites_medecin')
//         .select('*')
//         .eq('medecin_id', medecinData.id)
//         .order('jour_semaine', { ascending: true })

//       if (dispoError) throw dispoError
//       setDisponibilites(dispoData || [])
      
//       toast.success('Disponibilité ajoutée avec succès')
//       setNewDispo({
//         jour_semaine: 1,
//         heure_debut: '08:00',
//         heure_fin: '17:00',
//         lieu_id: '',
//         autre_lieu: '',
//         actif: true
//       })
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de l'ajout: ${error.message}`)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleAddConge = async () => {
//     if (!user) {
//       toast.error('Vous devez être connecté')
//       return
//     }

//     if (!newConge.date_debut || !newConge.date_fin) {
//       toast.error('Veuillez sélectionner des dates valides')
//       return
//     }

//     try {
//       setSubmitting(true)

//       // Vérifier que l'utilisateur est un médecin
//       const { data: medecinData, error: medecinError } = await supabase
//         .from('medecin_infos')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (medecinError || !medecinData) {
//         throw new Error('Vous devez être un médecin pour effectuer cette action')
//       }

//       const { error } = await supabase
//         .from('conges_medecin')
//         .insert([{
//           ...newConge,
//           medecin_id: medecinData.id
//         }])

//       if (error) throw error

//       // Recharger les congés
//       const { data: congesData, error: congesError } = await supabase
//         .from('conges_medecin')
//         .select('*')
//         .eq('medecin_id', medecinData.id)
//         .order('date_debut', { ascending: true })

//       if (congesError) throw congesError
//       setConges(congesData || [])
      
//       toast.success('Congé programmé avec succès')
//       setNewConge({
//         date_debut: '',
//         date_fin: '',
//         raison: ''
//       })
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de l'ajout: ${error.message}`)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const toggleDisponibilite = async (id: string, actif: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('disponibilites_medecin')
//         .update({ actif: !actif })
//         .eq('id', id)

//       if (error) throw error

//       setDisponibilites(prev => prev.map(d => 
//         d.id === id ? { ...d, actif: !actif } : d
//       ))
//       toast.success('Statut de disponibilité mis à jour')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de la mise à jour: ${error.message}`)
//     }
//   }

//   const deleteDisponibilite = async (id: string) => {
//     try {
//       const { error } = await supabase
//         .from('disponibilites_medecin')
//         .delete()
//         .eq('id', id)

//       if (error) throw error

//       setDisponibilites(prev => prev.filter(d => d.id !== id))
//       toast.success('Disponibilité supprimée')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de la suppression: ${error.message}`)
//     }
//   }

//   const deleteConge = async (id: string) => {
//     try {
//       const { error } = await supabase
//         .from('conges_medecin')
//         .delete()
//         .eq('id', id)

//       if (error) throw error

//       setConges(prev => prev.filter(c => c.id !== id))
//       toast.success('Congé supprimé')
//     } catch (error: any) {
//       console.error('Erreur:', error)
//       toast.error(`Erreur lors de la suppression: ${error.message}`)
//     }
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Redirection vers la page de connexion...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Gestion des disponibilités</h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Section disponibilités régulières */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Disponibilités hebdomadaires</h2>
          
//           <div className="space-y-4 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Jour</label>
//                 <select
//                   value={newDispo.jour_semaine}
//                   onChange={(e) => setNewDispo({...newDispo, jour_semaine: parseInt(e.target.value)})}
//                   className="w-full p-2 border rounded"
//                 >
//                   {joursSemaine.map(jour => (
//                     <option key={jour.id} value={jour.id}>{jour.nom}</option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">Heure début</label>
//                 <input
//                   type="time"
//                   value={newDispo.heure_debut}
//                   onChange={(e) => setNewDispo({...newDispo, heure_debut: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">Heure fin</label>
//                 <input
//                   type="time"
//                   value={newDispo.heure_fin}
//                   onChange={(e) => setNewDispo({...newDispo, heure_fin: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Lieu de consultation</label>
//                 <select
//                   value={newDispo.lieu_id}
//                   onChange={(e) => setNewDispo({...newDispo, lieu_id: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="">Sélectionnez un lieu</option>
//                   {lieuxConsultation.map(lieu => (
//                     <option key={lieu.id} value={lieu.id}>{lieu.nom}</option>
//                   ))}
//                 </select>
//               </div>
              
//               {newDispo.lieu_id === '' && (
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Autre lieu</label>
//                   <input
//                     type="text"
//                     value={newDispo.autre_lieu}
//                     onChange={(e) => setNewDispo({...newDispo, autre_lieu: e.target.value})}
//                     className="w-full p-2 border rounded"
//                     placeholder="Précisez le lieu"
//                   />
//                 </div>
//               )}
//             </div>
            
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="actif"
//                 checked={newDispo.actif}
//                 onChange={(e) => setNewDispo({...newDispo, actif: e.target.checked})}
//                 className="mr-2"
//               />
//               <label htmlFor="actif">Actif</label>
//             </div>
            
//             <button
//               onClick={handleAddDisponibilite}
//               disabled={submitting}
//               className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
//             >
//               {submitting ? 'Ajout en cours...' : 'Ajouter cette disponibilité'}
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             <h3 className="font-medium">Vos disponibilités actuelles</h3>
            
//             {disponibilites.length === 0 ? (
//               <p className="text-gray-500">Aucune disponibilité enregistrée</p>
//             ) : (
//               <div className="space-y-2">
//                 {disponibilites.map(dispo => {
//                   const jour = joursSemaine.find(j => j.id === dispo.jour_semaine)?.nom || ''
//                   const lieu = lieuxConsultation.find(l => l.id === dispo.lieu_id)?.nom || dispo.autre_lieu
                  
//                   return (
//                     <div key={dispo.id} className="flex justify-between items-center p-3 border rounded">
//                       <div>
//                         <p className="font-medium">{jour}: {dispo.heure_debut.slice(0,5)} - {dispo.heure_fin.slice(0,5)}</p>
//                         <p className="text-sm text-gray-600">{lieu}</p>
//                       </div>
                      
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => toggleDisponibilite(dispo.id, dispo.actif)}
//                           className={`p-1 rounded ${dispo.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
//                         >
//                           {dispo.actif ? 'Actif' : 'Inactif'}
//                         </button>
//                         <button
//                           onClick={() => deleteDisponibilite(dispo.id)}
//                           className="p-1 rounded bg-red-100 text-red-800"
//                         >
//                           Supprimer
//                         </button>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Section congés programmés */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Congés programmés</h2>
          
//           <div className="space-y-4 mb-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date début</label>
//                 <input
//                   type="date"
//                   value={newConge.date_debut}
//                   onChange={(e) => setNewConge({...newConge, date_debut: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium mb-1">Date fin</label>
//                 <input
//                   type="date"
//                   value={newConge.date_fin}
//                   onChange={(e) => setNewConge({...newConge, date_fin: e.target.value})}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium mb-1">Raison (optionnel)</label>
//               <input
//                 type="text"
//                 value={newConge.raison}
//                 onChange={(e) => setNewConge({...newConge, raison: e.target.value})}
//                 className="w-full p-2 border rounded"
//                 placeholder="Ex: Congé annuel, Formation..."
//               />
//             </div>
            
//             <button
//               onClick={handleAddConge}
//               disabled={submitting || !newConge.date_debut || !newConge.date_fin}
//               className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
//             >
//               {submitting ? 'Ajout en cours...' : 'Programmer ce congé'}
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             <h3 className="font-medium">Vos congés programmés</h3>
            
//             {conges.length === 0 ? (
//               <p className="text-gray-500">Aucun congé programmé</p>
//             ) : (
//               <div className="space-y-2">
//                 {conges.map(conge => (
//                   <div key={conge.id} className="flex justify-between items-center p-3 border rounded">
//                     <div>
//                       <p className="font-medium">
//                         {new Date(conge.date_debut).toLocaleDateString()} - {new Date(conge.date_fin).toLocaleDateString()}
//                       </p>
//                       {conge.raison && <p className="text-sm text-gray-600">{conge.raison}</p>}
//                     </div>
                    
//                     <button
//                       onClick={() => deleteConge(conge.id)}
//                       className="p-1 rounded bg-red-100 text-red-800"
//                     >
//                       Supprimer
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//    {/* <div className="mt-6">
//   <h3 className="font-medium mb-2">Calendrier des indisponibilités</h3>
//   <div className="border rounded p-4">
//     <DayPicker
//       mode="multiple"
//       selected={selectedDates}
//       onSelect={(dates) => setSelectedDates(dates || [])}
//       locale={fr}
//       modifiers={{
//         conge: conges.flatMap(c => {
//           const start = new Date(c.date_debut);
//           const end = new Date(c.date_fin);
//           const dates = [];
//           for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//             dates.push(new Date(d));
//           }
//           return dates;
//         })
//       }}
//       modifiersStyles={{
//         conge: { backgroundColor: '#fca5a5', color: '#b91c1c' }
//       }}
//       styles={{
//         root: { margin: '0 auto' },
//         caption: { color: '#1e40af' }
//       }}
//     />
//   </div>
//    </div> */}


//    <div className="mt-6">
//   <h3 className="font-medium mb-2">Calendrier des indisponibilités</h3>
//   <div className="border rounded p-4">
//     <DayPicker
//       mode="multiple"
//       selected={selectedDates}
//       onSelect={(dates) => setSelectedDates(dates || [])}
//       locale={fr}
//       modifiers={{
//         conge: conges.flatMap(c => {
//           const start = new Date(c.date_debut);
//           const end = new Date(c.date_fin);
//           const dates = [];
//           for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//             dates.push(new Date(d));
//           }
//           return dates;
//         })
//       }}
//       modifiersStyles={{
//         conge: { backgroundColor: '#fca5a5', color: '#b91c1c' }
//       }}
//     />
//     {selectedDates.length > 0 && (
//       <button
//         onClick={handleSaveSelectedDates}
//         disabled={submitting}
//         className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
//       >
//         {submitting ? 'Enregistrement...' : `Enregistrer ${selectedDates.length} indisponibilités`}
//       </button>
//     )}
//   </div>
// </div>
//                 </div>
//       </div>
//     </div>
//   )
// }
'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { supabase } from '@/lib/supabase/client'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { fr } from 'date-fns/locale'

export default function GestionDisponibilites() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lieuxConsultation, setLieuxConsultation] = useState<any[]>([])
  const [disponibilites, setDisponibilites] = useState<any[]>([])
  const [conges, setConges] = useState<any[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [newDispo, setNewDispo] = useState({
    jour_semaine: 1,
    heure_debut: '08:00',
    heure_fin: '17:00',
    lieu_id: '',
    autre_lieu: '',
    actif: true
  })
  const [newConge, setNewConge] = useState({
    date_debut: '',
    date_fin: '',
    raison: ''
  })

  const joursSemaine = [
    { id: 1, nom: 'Lundi' },
    { id: 2, nom: 'Mardi' },
    { id: 3, nom: 'Mercredi' },
    { id: 4, nom: 'Jeudi' },
    { id: 5, nom: 'Vendredi' },
    { id: 6, nom: 'Samedi' },
    { id: 7, nom: 'Dimanche' }
  ]

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Vérifier que l'utilisateur est un médecin
        const { data: medecinData, error: medecinError } = await supabase
          .from('medecin_infos')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (medecinError || !medecinData) {
          throw new Error('Vous devez être un médecin pour accéder à cette page')
        }

        // Charger les lieux de consultation
        const { data: lieuxData, error: lieuxError } = await supabase
          .from('lieux_consultation')
          .select('*')

        if (lieuxError) throw lieuxError
        setLieuxConsultation(lieuxData || [])

        // Charger les disponibilités existantes
        const { data: dispoData, error: dispoError } = await supabase
          .from('disponibilites_medecin')
          .select('*')
          .eq('medecin_id', medecinData.id)
          .order('jour_semaine', { ascending: true })

        if (dispoError) throw dispoError
        setDisponibilites(dispoData || [])

        // Charger les congés existants
        const { data: congesData, error: congesError } = await supabase
          .from('conges_medecin')
          .select('*')
          .eq('medecin_id', medecinData.id)
          .order('date_debut', { ascending: true })

        if (congesError) throw congesError
        setConges(congesData || [])

      } catch (error: any) {
        console.error('Erreur lors du chargement:', error)
        toast.error(`Erreur: ${error.message}`)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, authLoading, router])

  const handleSaveSelectedDates = async () => {
    if (!user || selectedDates.length === 0) return;

    try {
      setSubmitting(true);
      
      // Vérifier que l'utilisateur est un médecin
      const { data: medecinData, error: medecinError } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (medecinError || !medecinData) {
        throw new Error('Vous devez être un médecin pour effectuer cette action');
      }

      const congesToAdd = selectedDates.map(date => ({
        medecin_id: medecinData.id,
        date_debut: date.toISOString().split('T')[0],
        date_fin: date.toISOString().split('T')[0],
        raison: 'Indisponibilité ponctuelle'
      }));

      const { error } = await supabase
        .from('conges_medecin')
        .insert(congesToAdd);

      if (error) throw error;

      const { data: congesData, error: congesError } = await supabase
        .from('conges_medecin')
        .select('*')
        .eq('medecin_id', medecinData.id)
        .order('date_debut', { ascending: true });

      if (congesError) throw congesError;
      setConges(congesData || []);
      
      toast.success('Indisponibilités enregistrées avec succès');
      setSelectedDates([]);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(`Erreur lors de l'enregistrement: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDisponibilite = async () => {
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }

    try {
      setSubmitting(true)

      const { data: medecinData, error: medecinError } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (medecinError || !medecinData) {
        throw new Error('Vous devez être un médecin pour effectuer cette action')
      }

      const { error } = await supabase
        .from('disponibilites_medecin')
        .insert([{
          ...newDispo,
          medecin_id: medecinData.id,
          heure_debut: `${newDispo.heure_debut}:00`,
          heure_fin: `${newDispo.heure_fin}:00`
        }])

      if (error) throw error

      const { data: dispoData, error: dispoError } = await supabase
        .from('disponibilites_medecin')
        .select('*')
        .eq('medecin_id', medecinData.id)
        .order('jour_semaine', { ascending: true })

      if (dispoError) throw dispoError
      setDisponibilites(dispoData || [])
      
      toast.success('Disponibilité ajoutée avec succès')
      setNewDispo({
        jour_semaine: 1,
        heure_debut: '08:00',
        heure_fin: '17:00',
        lieu_id: '',
        autre_lieu: '',
        actif: true
      })
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'ajout: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddConge = async () => {
    if (!user) {
      toast.error('Vous devez être connecté')
      return
    }

    if (!newConge.date_debut || !newConge.date_fin) {
      toast.error('Veuillez sélectionner des dates valides')
      return
    }

    try {
      setSubmitting(true)

      const { data: medecinData, error: medecinError } = await supabase
        .from('medecin_infos')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (medecinError || !medecinData) {
        throw new Error('Vous devez être un médecin pour effectuer cette action')
      }

      const { error } = await supabase
        .from('conges_medecin')
        .insert([{
          ...newConge,
          medecin_id: medecinData.id
        }])

      if (error) throw error

      const { data: congesData, error: congesError } = await supabase
        .from('conges_medecin')
        .select('*')
        .eq('medecin_id', medecinData.id)
        .order('date_debut', { ascending: true })

      if (congesError) throw congesError
      setConges(congesData || [])
      
      toast.success('Congé programmé avec succès')
      setNewConge({
        date_debut: '',
        date_fin: '',
        raison: ''
      })
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de l'ajout: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleDisponibilite = async (id: string, actif: boolean) => {
    try {
      const { error } = await supabase
        .from('disponibilites_medecin')
        .update({ actif: !actif })
        .eq('id', id)

      if (error) throw error

      setDisponibilites(prev => prev.map(d => 
        d.id === id ? { ...d, actif: !actif } : d
      ))
      toast.success('Statut de disponibilité mis à jour')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la mise à jour: ${error.message}`)
    }
  }

  const deleteDisponibilite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('disponibilites_medecin')
        .delete()
        .eq('id', id)

      if (error) throw error

      setDisponibilites(prev => prev.filter(d => d.id !== id))
      toast.success('Disponibilité supprimée')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  const deleteConge = async (id: string) => {
    try {
      const { error } = await supabase
        .from('conges_medecin')
        .delete()
        .eq('id', id)

      if (error) throw error

      setConges(prev => prev.filter(c => c.id !== id))
      toast.success('Congé supprimé')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error(`Erreur lors de la suppression: ${error.message}`)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirection vers la page de connexion...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des disponibilités</h1>
          <p className="mt-2 text-lg text-gray-600">
            Configurez vos horaires de consultation et vos périodes d'indisponibilité
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section disponibilités régulières */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Disponibilités hebdomadaires</h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
                    <select
                      value={newDispo.jour_semaine}
                      onChange={(e) => setNewDispo({...newDispo, jour_semaine: parseInt(e.target.value)})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {joursSemaine.map(jour => (
                        <option key={jour.id} value={jour.id}>{jour.nom}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                    <input
                      type="time"
                      value={newDispo.heure_debut}
                      onChange={(e) => setNewDispo({...newDispo, heure_debut: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                    <input
                      type="time"
                      value={newDispo.heure_fin}
                      onChange={(e) => setNewDispo({...newDispo, heure_fin: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de consultation</label>
                    <select
                      value={newDispo.lieu_id}
                      onChange={(e) => setNewDispo({...newDispo, lieu_id: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un lieu</option>
                      {lieuxConsultation.map(lieu => (
                        <option key={lieu.id} value={lieu.id}>{lieu.nom}</option>
                      ))}
                    </select>
                  </div>
                  
                  {newDispo.lieu_id === '' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Autre lieu</label>
                      <input
                        type="text"
                        value={newDispo.autre_lieu}
                        onChange={(e) => setNewDispo({...newDispo, autre_lieu: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Précisez le lieu"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="actif"
                    checked={newDispo.actif}
                    onChange={(e) => setNewDispo({...newDispo, actif: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
                    Actif
                  </label>
                </div>
                
                <button
                  onClick={handleAddDisponibilite}
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 flex justify-center items-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </>
                  ) : 'Ajouter cette disponibilité'}
                </button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Vos disponibilités actuelles</h3>
                
                {disponibilites.length === 0 ? (
                  <div className="text-center py-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Aucune disponibilité enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {disponibilites.map(dispo => {
                      const jour = joursSemaine.find(j => j.id === dispo.jour_semaine)?.nom || ''
                      const lieu = lieuxConsultation.find(l => l.id === dispo.lieu_id)?.nom || dispo.autre_lieu
                      
                      return (
                        <div key={dispo.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">
                              {jour}: {dispo.heure_debut.slice(0,5)} - {dispo.heure_fin.slice(0,5)}
                            </p>
                            <p className="text-sm text-gray-500">{lieu}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleDisponibilite(dispo.id, dispo.actif)}
                              className={`px-3 py-1 rounded-md text-sm font-medium ${
                                dispo.actif 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {dispo.actif ? 'Actif' : 'Inactif'}
                            </button>
                            <button
                              onClick={() => deleteDisponibilite(dispo.id)}
                              className="px-3 py-1 rounded-md bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Section congés programmés */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Congés programmés</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
                      <input
                        type="date"
                        value={newConge.date_debut}
                        onChange={(e) => setNewConge({...newConge, date_debut: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
                      <input
                        type="date"
                        value={newConge.date_fin}
                        onChange={(e) => setNewConge({...newConge, date_fin: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Raison (optionnel)</label>
                    <input
                      type="text"
                      value={newConge.raison}
                      onChange={(e) => setNewConge({...newConge, raison: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Congé annuel, Formation..."
                    />
                  </div>
                  
                  <button
                    onClick={handleAddConge}
                    disabled={submitting || !newConge.date_debut || !newConge.date_fin}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 flex justify-center items-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ajout en cours...
                      </>
                    ) : 'Programmer ce congé'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Vos congés programmés</h3>
                  
                  {conges.length === 0 ? (
                    <div className="text-center py-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                      <p className="mt-1 text-sm text-gray-500">Aucun congé programmé</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conges.map(conge => (
                        <div key={conge.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(conge.date_debut).toLocaleDateString('fr-FR')} - {new Date(conge.date_fin).toLocaleDateString('fr-FR')}
                            </p>
                            {conge.raison && <p className="text-sm text-gray-500">{conge.raison}</p>}
                          </div>
                          
                          <button
                            onClick={() => deleteConge(conge.id)}
                            className="px-3 py-1 rounded-md bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200"
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Calendrier des indisponibilités */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendrier des indisponibilités</h2>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <DayPicker
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => setSelectedDates(dates || [])}
                    locale={fr}
                    modifiers={{
                      conge: conges.flatMap(c => {
                        const start = new Date(c.date_debut);
                        const end = new Date(c.date_fin);
                        const dates = [];
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          dates.push(new Date(d));
                        }
                        return dates;
                      })
                    }}
                    modifiersStyles={{
                      conge: { backgroundColor: '#fca5a5', color: '#b91c1c' }
                    }}
                    styles={{
                      root: { margin: '0 auto' },
                      caption: { color: '#1e40af', fontWeight: '600' },
                      day: { margin: '0.2em' },
                      cell: { borderRadius: '0.375rem' }
                    }}
                  />
                  
                  {selectedDates.length > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} sélectionnée{selectedDates.length > 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={handleSaveSelectedDates}
                        disabled={submitting}
                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200 flex items-center"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enregistrement...
                          </>
                        ) : 'Enregistrer les indisponibilités'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}