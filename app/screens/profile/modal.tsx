// import React from 'react'
// import { View, StyleSheet } from 'react-native';

// const ModalScreen = () => {
//     return (
//         <View style={styles.container}>
//             {/* Modal in here */}


//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//     },
// });

// export default ModalScreen;

// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// const OptionsModal = () => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleOptionPress = (option) => {
//     alert(`You selected: ${option}`);
//     closeModal();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={openModal} style={styles.openButton}>
//         <Text style={styles.buttonText}>Open Options</Text>
//       </TouchableOpacity>
      
//       <Modal
//         transparent={true}
//         animationType="slide"
//         visible={modalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <TouchableOpacity onPress={() => handleOptionPress('Camera')} style={styles.optionButton}>
//               <Text style={styles.optionText}>Camera</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleOptionPress('Library')} style={styles.optionButton}>
//               <Text style={styles.optionText}>Library</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleOptionPress('Remove')} style={styles.optionButton}>
//               <Text style={styles.optionText}>Remove</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   openButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   optionButton: {
//     padding: 15,
//     width: '100%',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   optionText: {
//     fontSize: 18,
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: '#ff4d4d',
//     padding: 10,
//     borderRadius: 10,
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default OptionsModal;