import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; 
import { View, Text, FlatList, StyleSheet, TextInput, Button, TouchableOpacity, Modal, ScrollView, Picker } from 'react-native';
import axios from 'axios';

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchIngredient, setSearchIngredient] = useState([]);
  const [name, setName] = useState('');
  const [carb, setCarb] = useState('');
  const [xo, setXo] = useState('');
  const [fat, setFat] = useState('');
  const [protein, setProtein] = useState('');
  const [kcal, setKcal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentIngreId, setCurrentIngreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7); // Số phần tử trên mỗi trang
  const [totalPages, setTotalPages] = useState(1);    

  useEffect(() => {
    if (searchTerm) {
        const filteredIngredients = ingredients.filter(ingre =>
          ingre.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setIngredients(filteredIngredients);
      } else {
        fetchIngredient();
      }
    }, [searchTerm]);

  const fetchIngredient = () => {
    axios.get('http://localhost:5000/ingredients/getall', {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      })
      .then((response) => {
        setIngredients(response.data.ingredients); // Lưu danh sách ingredients
        setTotalPages(response.data.totalPages); // Tổng số trang được trả về từ API
      })
      .catch((error) => console.error(error));
  };

  const addIngredient = () => {
    try {
      const newIngre = { name, carb, xo, fat, protein, kcal};
      if (editMode) {
        // chỉnh sửa ingredient
        axios.put(`http://localhost:5000/ingredients/update/${currentIngreId}`, newIngre)
          .then(response => {
            console.log('Ingredient updated', response.data);
            resetForm();
            fetchIngredient();
          })
          .catch(error => console.error(error));
      } else {
        // Thêm ingredient
        axios.post('http://localhost:5000/ingredients/add', newIngre)
          .then(response => {
            console.log('Ingredient added', response.data);
            resetForm();
            fetchIngredient();
          })  
      }
    } catch (error) {
      console.error('Error adding ingredient:', error.response.data);
    }};
  

  const deleteIngredient = (IngreId) => {
    axios.delete(`http://localhost:5000/ingredients/delete/${IngreId}`)
      .then(response => {
        console.log('Ingredient deleted', response.data);
        fetchIngredient(); // Cập nhật danh sách sau khi xóa nguyên liệu
      })
      .catch(error => console.error(error));
  };

  const editIngredient = (ingre) => {
    setCurrentIngreId(ingre._id);
    setName(ingre.name);
    setCarb(ingre.carb);
    setXo(ingre.xo);
    setFat(ingre.fat);
    setProtein(ingre.protein);
    setKcal(ingre.kcal);
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentIngreId(null);
    setName('');
    setCarb('');
    setXo('');
    setFat('');
    setProtein('');
    setKcal('');
    setEditMode(false);
    setShowModal(false);
  };

  const filterIngre = () => {
  if (searchTerm) {
    const filteredIngredients = ingredients.filter(ingre => 
      ingre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return paginate(filteredIngredients, currentPage, itemsPerPage);
  }
  return paginate(ingredients, currentPage, itemsPerPage);
};

const paginate = (items, page, perPage) => {
  const startIndex = (page - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
};

const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <ScrollView style={styles.container}>
    <Text style={styles.title}>Ingredient Management</Text>

    <View style={styles.searchRow}>
      <TextInput
      style={[styles.input, styles.searchInput]} 
      placeholder="Search by Name"
      value={searchTerm}
      onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={fetchIngredient} />
      <Button title="Add Ingredient" onPress={() => setShowModal(true)} />
    </View>

    {/* User List */}
    <FlatList
      data={filterIngre()}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.namecell}>{item.name}</Text>
          <Text style={styles.carbcell}>{item.carb}</Text>
          <Text style={styles.xocell}>{item.xo}</Text>
          <Text style={styles.fatcell}>{item.fat}</Text>
          <Text style={styles.proteincell}>{item.protein}</Text>
          <Text style={styles.kcalcell}>{item.kcal}</Text>
          <View style={styles.actionCell}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editIngredient(item)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteIngredient(item._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <Text style={styles.nameheaderCell}>Thực phẩm (100g)</Text>
          <Text style={styles.carbheaderCell}>Carb (g)</Text>
          <Text style={styles.xoheaderCell}>Xơ (g)</Text>
          <Text style={styles.fatheaderCell}>Fat (g)</Text>
          <Text style={styles.proteinheaderCell}>Protein (g)</Text>
          <Text style={styles.kcalheaderCell}>Calo / Kcal</Text>
          <Text style={styles.actionheaderCell}>Actions</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <View style={styles.paginationContainer}>
          <TouchableOpacity style={styles.paginationButton} onPress={handlePreviousPage} disabled={currentPage === 1}>
            <Text style={styles.paginationText}>Previous</Text>
          </TouchableOpacity>
    
          <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>

          <TouchableOpacity style={styles.paginationButton} onPress={handleNextPage} disabled={currentPage === totalPages}>
            <Text style={styles.paginationText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    />

    {/* Modal for Add/Edit Ingredient Form */}
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{editMode ? 'Edit Ingredient' : 'Add New Ingredient'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Carb (g)"
            value={carb}
            onChangeText={setCarb}
          />
          <TextInput
            style={styles.input}
            placeholder="Xơ (g)"
            value={xo}
            onChangeText={setXo}
          />
          <TextInput
            style={styles.input}
            placeholder="Fat (g)"
            value={fat}
            onChangeText={setFat}
          />
          <TextInput
            style={styles.input}
            placeholder="Protein (g)"
            value={protein}
            onChangeText={setProtein}
          />
          <TextInput
            style={styles.input}
            placeholder="Calo / Kcal"
            value={kcal}
            onChangeText={setKcal}
          />
          <Button style={styles.modalButton} title={editMode ? 'Update Ingredient' : 'Submit'} onPress={addIngredient} />
          <Button style={styles.modalButton} title="Cancel" color="red" onPress={resetForm} />
        </View>
      </View>
    </Modal>
  </ScrollView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  searchInput: {
    flex: 1, 
    marginRight: 10, 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
    paddingVertical: 5, // Căn giữa hàng dọc cho nút
    paddingLeft: 10,
    paddingRight: 10,
  },
  namecell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5, 
    paddingLeft: 10,
  },
  carbcell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5,
    paddingLeft: 10, 
    textAlign: 'center',
  },
  xocell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5,
    paddingLeft: 10, 
    textAlign: 'center',
  },
  fatcell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5,
    paddingLeft: 10, 
    textAlign: 'center',
  },
  proteincell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5,
    paddingLeft: 10, 
    textAlign: 'center',
  },
  kcalcell: {
    flex: 1,
    fontSize: 16,
    height: 44,
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8, 
    paddingHorizontal: 5,
    paddingLeft: 10, 
    textAlign: 'center',
  },
  actionCell: {
    width: 200,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 5, 
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  nameheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  carbheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  xoheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  fatheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  proteinheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  kcalheaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  actionheaderCell: {
    width: 200,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 6,
    marginRight: 10,
    borderRadius: 5,
    alignItems: 'center', // Đảm bảo nút nằm gọn trong cột
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center', // Đảm bảo nút nằm gọn trong cột
  },
  deleteButtonText: {
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '40%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalButton: {
    marginVertical: 5, // Tạo khoảng cách giữa các nút
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Để nút có chiều rộng đầy đủ của modal
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  paginationText: {
    color: '#000',
    fontSize: 16,
  }
});

export default IngredientManagement;
