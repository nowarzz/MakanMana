import React, { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import {
  Content,
  Container,
  Header,
  Title,
  Left,
  Body,
  Right,
  Icon,
  Text,
  Button,
  Spinner,
  Form,
  Item,
  Input,
  Label,
  Picker
} from 'native-base';
import mRestoran from '../Model/Restoran';
import mWilayah from "../Model/Wilayah";
import mHarga from '../Model/Harga';
import moment from 'moment-timezone';
import Reactotron from 'reactotron-react-native';
const mRes = new mRestoran();
const mWil = new mWilayah();
const mHar = new mHarga();
export default function RestoranDetail(props){

  const inputs = [];
  const [isLoading,setIsLoading] = useState(false);
  const [kodeRestoran, setKodeRestoran] = useState(null);
  const [namaRestoran, setNamaRestoran] = useState(null);
  const [hargaRestoran, setHargaRestoran] = useState(null);
  const [wilayahRestoran, setWilayahRestoran] = useState(null);
  const [listHarga, setListHarga] = useState([]);
  const [listWilayah, setListWilayah] = useState([]);

  useEffect(()=>{
    loadData();
    const didFocusListener = props.navigation.addListener('didFocus',componentFocus);
    return(()=>{
      didFocusListener.remove();
    })
  },[]);

  const loadData = ()=>{
    setIsLoading(true);
    const {params} = props.navigation.state;
    const _kodeRestoran = params.kodeRestoran;
    if (_kodeRestoran) {
      mRes.loadRestoranById(_kodeRestoran).then(resp => {
        if(resp.success){
          setKodeRestoran(_kodeRestoran);
          setNamaRestoran(resp.data.namaRestoran);
          setHargaRestoran(resp.data.hargaRestoran);
          setWilayahRestoran(resp.data.wilayahRestoran);
        }else{
          Alert.alert("Information",resp.info);
        }
      }).catch(err => {
        Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
      }).finally(()=>{
        setIsLoading(false);
      })
    }else{
      setIsLoading(false);
    }
  }

  const loadWilayah = ()=> {
    mWil.loadAllWilayah().then(resp => {
      if(resp.success){
        setListWilayah(resp.data);
      }
    }).catch(err => {
      Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
    });
  }

  const loadHarga = ()=> {
    mHar.loadAllHarga().then(resp => {
      if(resp.success){
        setListHarga(resp.data);
      }
    }).catch(err => {
      Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
    });
  }

  const componentFocus = (payload) => {
    loadWilayah();
    loadHarga();
    loadData();
  }
  
  const goBack = ()=> {
    props.navigation.state.params.onBack();
    props.navigation.goBack();
  }

  const renderHeader = ()=> (
    <Header>
      <Left>
        <Button transparent onPress={goBack}>
          <Icon name="arrow-back" />
          <Text style={{ color: "white" }}> Back</Text>
        </Button>
      </Left>
      <Body>
        <Title>Restoran Detail</Title>
      </Body>
      <Right />
    </Header>
  )
  
  const simpanRestoran = ()=> {
    const {params} = props.navigation.state;
    var _kodeRestoran = params.kodeRestoran;
    if(!kodeRestoran){
      _kodeRestoran = `restoran-${moment().format("YYYYMMDDHHmmss")}`;
      setKodeRestoran(_kodeRestoran);
    }
    mRes.simpanRestoran(_kodeRestoran, namaRestoran,hargaRestoran,wilayahRestoran).then(resp => {
      Alert.alert("Sukses","Data Berhasil Disimpan");
      goBack();
    }).catch(err => {
      Alert.alert("Unexpected Error",`${err.name}: ${err.message}`);
    });
  }


  if(isLoading) {
    return(
      <Container>
        {renderHeader()}
        <Content>
          <Spinner/>
        </Content>
      </Container>
    )
  }


  const _render = (
    <Container>
      {renderHeader()}
      <Content>
        <Form>
          <Item stackedLabel>
            <Label>Kode Restoran</Label>
            <Input
              value={kodeRestoran}
              editable={false}
              ref={ref=>inputs[0] = ref}
            />
          </Item>
          <Item stackedLabel>
            <Label>Nama Restoran</Label>
            <Input
              value={namaRestoran}
              ref={ref=>inputs[1] = ref}
              onChangeText={val => setNamaRestoran(val)}
            />
          </Item>
          <Item picker>
            <Picker
              selectedValue={hargaRestoran}
              onValueChange={val => setHargaRestoran(val)}
            >
              <Picker.Item label="Pilih Rentan Harga Restoran" value={null} />
              {listHarga.map((val,index)=> (
                <Picker.Item key={index} label={val.namaHarga} value={val._id} />
              ))}
            </Picker>
          </Item>
          <Item picker>
            <Picker
              selectedValue={wilayahRestoran}
              onValueChange={val => setWilayahRestoran(val)}
            >
              <Picker.Item label="Pilih Wilayah Restoran" value={null} />
              {listWilayah.map((val,index)=> (
                <Picker.Item key={index} label={val.namaWilayah} value={val._id} />
              ))}
            </Picker>
          </Item>
          <Button primary style={{marginTop:10,marginLeft:10}} onPress={simpanRestoran}>
            <Text>Simpan</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  )

  return _render;
}

RestoranDetail.propTypes = {
  navigation: PropTypes.shape({
    state:PropTypes.shape({
      params:PropTypes.shape({
        onBack:PropTypes.func.isRequired,
        kodeRestoran:PropTypes.string
      })
    })
  })
}