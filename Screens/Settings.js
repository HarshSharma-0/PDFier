import React, { useEffect,useState } from 'react';
import Colors from '../constants/colours';
import {View,FlatList, ScrollView, StyleSheet } from 'react-native';
import {
  Title,
  Card,
  List,
  Switch,
  Divider,
  Button,
  useTheme,
  TextInput,
  Modal,
  IconButton,
  Portal,
  Appbar,
  Checkbox,
  TouchableRipple,
  SegmentedButtons,
} from 'react-native-paper';
import { usePDFier } from '../PdfierProvider/DataProvider';
import { BlurView } from 'expo-blur';
import {MaterialCommunityIcons,MaterialIcons,Foundation, FontAwesome5 } from '@expo/vector-icons';

const Settings = () => {

  const theme = useTheme();
  const [isInput, setInput] = useState(false);
  const [Max,setMax] = useState(true);
  const [Type,setType] = useState(true);
  const [Store,setStore] = useState(true);
  const [StorePdf,setStorePdf] = useState(true);

  const {SaveSettings,CopyPdf,setCopyPdf,Save,setSave, ViewType,setViewType,MaxPdfView,setMaxView ,PageSize,setPageSize,pageSizes,dark,isDark,Notification,setNotification,Orientaion,setOrientation} = usePDFier();


useEffect(() => {
SaveSettings();
},[
  Notification,
  Orientaion,
  PageSize,
  MaxPdfView,
  ViewType,
  Save,
  CopyPdf,
]);


  return (
    <View style={{flex:1}}>
      <Appbar.Header style={{backgroundColor:'transparent',elevation:0}}>
        <Appbar.Content
          title="SETTINGS"
          titleStyle={{
              fontSize: 50, // Set your desired font size
              fontWeight: 'bold',
              alignSelf:'center',
              color:Colors.pink,
          }}
        />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="General Settings" />
          <Card.Content>
            <List.Item
              title="Enable Notifications"
              left={() => <List.Icon icon="bell" color={Colors.pink} />}
              right={() => <Switch value={Notification} color={Colors.pink} onValueChange={() => setNotification(!Notification)} />}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              left={() => <List.Icon icon="brightness-4" color={Colors.pink} />}
              right={() => <Switch value={true} color={Colors.pink} onValueChange={() => isDark(!dark)} />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="PDF Page" />
          <Card.Content>
<List.Section>
      <List.Accordion
        rippleColor={Colors.pink}
        title="Orientation"
        description="Set the Orientation of PDF"
        left={() => <List.Icon icon="phone-rotate-landscape" color={Colors.pink} />}
        theme={{ colors: { primary: Colors.pink }}}
      >
            <List.Item
              title="Orientaion Potrait"
              left={() => <List.Icon icon="crop-portrait" color={Colors.pink} />}
              right={() => <Checkbox status={Orientaion ? 'checked' : 'unchecked'}/>}
              onPress={() => setOrientation(!Orientaion)}
            />
                      <Divider  style={{backgroundColor:Colors.pink,marginLeft:20,marginRight:20}}/>
            <List.Item
              title="Orientaion LandScape"
              left={() => <List.Icon icon="crop-landscape" color={Colors.pink} />}
              right={() => <Checkbox status={Orientaion ? 'unchecked' : 'checked'}/>}
              onPress={() => setOrientation(!Orientaion)}
            />
      </List.Accordion>
            <Divider  style={{backgroundColor:Colors.pink}}/>
</List.Section>

<List.Section>
      <List.Accordion
              rippleColor={Colors.pink}
              title="Select PageSize"
              description="Set the page dimensions of pdf"
              left={() => <List.Icon icon="format-page-split" color={Colors.pink} />}
              theme={{ colors: { primary: Colors.pink }}}
             >
{pageSizes.map((item, index) => (
          <List.Item
            key={index}
            title={item.label}
            description={`(${item.dimensions})`}
            left={() => <Checkbox status={PageSize === index ? 'checked' : 'unchecked'} />}
            onPress={() => setPageSize(index)}
          />
      ))}
      </List.Accordion>
            <Divider  style={{backgroundColor:Colors.pink}}/>
</List.Section>
          </Card.Content>


        </Card>
        <Card style={styles.card}>
          <Card.Title title="PDF Viewer" />
          <Card.Content>
            <List.Item
              title="Max PDFs"
              description="Set the Maximun pdfs viewed once in viewer"
              left={() => <List.Icon icon="file-pdf-box" color={Colors.pink} />}
              right={() => <List.Icon icon="chevron-right" color={Colors.pink} />}
              onPress={()=> setMax(!Max)}
            />

 {Max ?
<>
<SegmentedButtons
theme={{ colors: { primary: Colors.pink } }}
        value={MaxPdfView}
        onValueChange={(val) => {
         setMaxView(val)
}}
        buttons={[
          {
            value: 5,
            label: "5",
            showSelectedCheck: true,
          },
          {
            value: 8,
            label: '8',
            showSelectedCheck: true,

          },
          {
            value: 12 ,
            label: '12',
            showSelectedCheck: true,
          },
          {
            value: 15 ,
            label: '15',
            showSelectedCheck: true,
          },
        ]}
      />
            <Divider  style={{backgroundColor:Colors.pink,margin:5}}/>
</>
: null}
            <Divider />
            <List.Item
              title="View Type"
              description="Set the PDF view type"
              left={() => <List.Icon icon="view-split-vertical" color={Colors.pink} />}
              right={() => <List.Icon icon="chevron-right" color={Colors.pink} />}
              onPress={()=> setType(!Type)}
            />
 {Type ?
<>
<SegmentedButtons
theme={{ colors: { primary: Colors.pink } }}
        value={ViewType}
        onValueChange={(val) => {
         setViewType(val)
}}
        buttons={[
          {
            value: false,
            label: "Single Tap View",
            showSelectedCheck: true,
            icon: ({ size, color }) => <Foundation name="page-doc" size={size} color={color} />,
          },
          {
            value: true,
            label: 'Split View',
            showSelectedCheck: true,
            icon: ({ size, color }) => <MaterialIcons name="view-agenda" size={size} color={color} />,
          },
        ]}
      />
            <Divider  style={{backgroundColor:Colors.pink,margin:5}}/>
</>
: null}
            <Divider />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="PDF Savings Options" />
          <Card.Content>
            <List.Item
              title="Created PDFs"
              description="Choose where to store created Docs"
              left={() => <List.Icon icon="creation" color={Colors.pink} />}
              right={() => <List.Icon icon="chevron-right" color={Colors.pink} />}
              onPress={()=> setStore(!Store)}
            />
 {Store ?
<>
<SegmentedButtons
theme={{ colors: { primary: Colors.pink } }}
        value={Save}
        onValueChange={(val) => {
         setSave(val)
}}
        buttons={[
          {
            value: true,
            label: "Cache",
            showSelectedCheck: true,
            icon: ({ size, color }) => <MaterialCommunityIcons name="server-minus" size={size} color={color} />,
          },
          {
            value: false,
            label: 'Internal',
            showSelectedCheck: true,
            icon: ({ size, color }) => <MaterialIcons name="storage" size={size} color={color} />,
          },
        ]}
      />
            <Divider  style={{backgroundColor:Colors.pink,margin:5}}/>
</>
: null}
            <Divider />
            <List.Item
              title="PDF book"
              description="Should Copy added pdfs to App storage or not "
              left={() => <List.Icon icon="notebook-multiple" color={Colors.pink} />}
              right={() => <List.Icon icon="chevron-right" color={Colors.pink} />}
              onPress={()=> setStorePdf(!StorePdf)}
            />
 {StorePdf ?
<>
<SegmentedButtons
theme={{ colors: { primary: Colors.pink } }}
        value={CopyPdf}
        onValueChange={(val) => {
         setCopyPdf(val)
}}
        buttons={[
          {
            value: false,
            label: "Cache",
            showSelectedCheck: true,
            icon: ({ size, color }) => <MaterialCommunityIcons name="server-minus" size={size} color={color} />,
          },
          {
            value: true,
            label: 'Internal',
            showSelectedCheck: true,
            icon: ({ size, color }) => <MaterialIcons name="storage" size={size} color={color} />,
          },
        ]}
      />
            <Divider  style={{backgroundColor:Colors.pink,margin:5}}/>
</>
: null}
            <Divider />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="About" />
          <Card.Content>
            <List.Item
              title="Version"
              description="2.0.0"
              left={() => <List.Icon icon="information" color={Colors.pink} />}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              left={() => <List.Icon icon="lock" color={Colors.pink} />}
              right={() => <List.Icon icon="chevron-right" color={Colors.pink} />}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    marginVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    alignItems:'center',
    justifyContent:'center',
  },
});

export default Settings;
