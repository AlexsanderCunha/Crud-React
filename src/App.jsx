import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios  from "axios";
import { useEffect, useState } from "react";
import ModalComp from "./components/ModalComp";

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});

  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  useEffect(() => {
    getContacts()
  }, [setData]);

  async function getContacts() {
    try {
      const response = await axios.get('http://localhost:8080/contacts', {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      setData(response.data)
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao buscar contatos!!")
    }
  }

  async function saveContact(dataEdit){
    try {
        await axios.post('http://localhost:8080/contacts', dataEdit, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      getContacts()
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao salvar contato!")
    }
  }

  async function updateContact(dataEdit){
    try {
        await axios.put(`http://localhost:8080/contacts/${dataEdit.id}`, dataEdit, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      getContacts()
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao atualizar!!")
    }
  }

  async function handleRemoveContact(id){
    try {
       await axios.delete(`http://localhost:8080/contacts/${id}`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      });
      getContacts()
    } catch (error) {
      console.error(error);
      alert("Houve um erro ao delete contato!")
    }
  };

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      fontSize="20px"
      fontFamily="poppins"
    >
      <Box maxW={800} w="100%" h="100vh" py={10} px={2}>
        <Button colorSheme="blue" onClick={() => [setDataEdit({}), onOpen()]}>
          Novo Cadastro
        </Button>
        <Box overflowY="auto" height="100%">
          <Table mt="6">
            <Thead>
              <Tr>
                  <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                    Nome
                  </Th>
                  <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                    E-Mail
                  </Th>
                  <Th maxW={isMobile ? 5 : 100} fontSize="20px">
                    Telefone
                  </Th>
                  <Th p={0}></Th>
                  <Th p={0}></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(({ id, name, email, phone }, index) => (
                <Tr key={index} cursor="pointer " _hover={{ bg: "gray.100" }}>
                  <Td maxW={isMobile ? 5 : 100}>{name}</Td>
                  <Td maxW={isMobile ? 5 : 100}>{email}</Td>
                  <Td maxW={isMobile ? 5 : 100}>{phone}</Td>
                  <Td p={0}>
                    <EditIcon
                      fontSize={20}
                      onClick={() => [
                        setDataEdit({ id, name, email, phone }),
                        onOpen(),
                      ]}
                    />
                  </Td>
                  <Td p={0}>
                    <DeleteIcon
                      fontSize={20}
                      onClick={() => handleRemoveContact(id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      {isOpen && (
        <ModalComp
          isOpen={isOpen}
          onClose={onClose}
          data={data}
          saveContact={saveContact}
          updateContact={updateContact}
          dataEdit={dataEdit}
          setDataEdit={setDataEdit}
        />
      )}
    </Flex>
  );
};

export default App;
