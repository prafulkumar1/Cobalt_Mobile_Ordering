import React from 'react';
import { FlatList, ImageBackground, Image, TouchableOpacity, View, Alert, Animated, Modal, Pressable, } from 'react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CircleIcon, AddIcon, TrashIcon, RemoveIcon,ChevronRightIcon } from '@/components/ui/icon';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from '@/components/ui/checkbox';
import { Select, SelectIcon, SelectInput, SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from '../ui/select';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon } from '@/components/ui/radio';
import { postApiCall } from '@/components/utlis/api';
import { getFormFieldData, getFormFieldDataSelector, setFormFieldData } from '../redux/reducers/loginReducer';
import { connect } from 'react-redux';
import { SvgUri } from 'react-native-svg';
class CbImage extends React.Component {
  constructor(props) {
    super(props);
    // this.id=props.id;
    this.source = props.source || "";
    this.imageJsx = props.imageJsx;
    this.style = props.style || "";
  }

  render() {
    const jsx = this.imageJsx;
    const source = this.source;

    if (source) {

      if (source.endsWith('.svg')) {

        return <SvgUri  uri={source}/>;
      } else {
 
        return <Image alt='image' source={{ uri: source }} style={this.style} />;
      }
    } else {
      return jsx;
    }
  }
}
 
class cbButton extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.buttonText = props.text || "Button";
    this.variant = props.variant || "solid";
    this.onPress = props.onPress;
    this.customStyles = props.customStyles || '';
  }
 
  render() {
 
    const buttonArray = global.controlsConfigJson.find((item) => item.id === this.id);
    const variant = buttonArray?.variant || this.variant;
    const buttonText = buttonArray?.text || this.buttonText;
    const buttonStyle = this.customStyles.buttonStyle;
    const buttonTextStyle = this.customStyles.buttontextStyle;
 
    return (
      <Button variant={variant} onPress={() => this.onPress()} style={buttonStyle}  >
        <ButtonText style={buttonTextStyle} numberOfLines={1} ellipsizeMode="tail">{buttonText}</ButtonText>
      </Button>
    );
  }
}
 
class cbCheckBox extends React.Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.size = props.size || 'md';
    this.isDisabled = props.isDisabled || false;
    this.isInvalid = props.isInvalid || false;
    this.checkBoxLabel = props.Label || '';
    this.customStyles = props.customStyles || '';
  }
 
  render() {
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const checkBoxLabelprop = inputArray?.labeltext || this.checkBoxLabel;
    const indicatorStyle = this.customStyles.CheckboxIndicator;
    const labelStyle = this.customStyles.checkboxLabel;
 
    return (
      <Checkbox size={this.size} isInvalid={this.isInvalid} isDisabled={this.isDisabled} style={{flexDirection:"row"}}>
        <CheckboxIndicator style={{width:20,height:20,borderWidth:1,borderColor:"#fff",backgroundColor:"#fff"}}>
          <CheckboxIcon as={CheckIcon} size='md' style={{color:"blue"}}/>
        </CheckboxIndicator>
        <CheckboxLabel  style={labelStyle}>{checkBoxLabelprop}</CheckboxLabel>
      </Checkbox>
    );
  }
}
 
 
 
class cbImageBackground extends React.Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.source = props.source || null;
    this.styles = props.styles || null;
  }
 
  render() {
    const { children } = this.props;
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const sourceprop = inputArray?.source || this.source;
    const styleprop = inputArray?.styles || this.styles;
 
    return (
      <ImageBackground source={sourceprop} alt='login' style={styleprop?.container} >
        {children}
      </ImageBackground>
    );
  }
}
 
class cbRadioButton extends React.Component {
 
  constructor(props) {
    super(props);
    this.id = props.id;
    this.alignment = props.alignment || 'vertical';
    this.Label = props.Label || '';
    this.options = Array.isArray(props.options) ? props.options : [];
  }
 
 
  render() {
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const radiolabelprop = inputArray?.labelText || this.selectLabel;
    const selectItems = Array.isArray(inputArray?.options) ? inputArray.options : this.options;
    const alignmentprop = inputArray?.alignment || this.alignment;
    const Stack = alignmentprop === 'vertical' ? VStack : HStack;
    return (
 
      <FormControl>
        <VStack space="md">
          <FormControlLabel>
            <FormControlLabelText>{radiolabelprop}</FormControlLabelText>
          </FormControlLabel>
          <RadioGroup>
            <Stack space="sm">
              {selectItems.map((item, index) => (
                <Radio key={index} value={item.value} size="md" >
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>{item.label}</RadioLabel>
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </VStack >
      </FormControl>
 
    );
  }
}

class cbSelect extends React.Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.placeholder = props.placeholder || 'Select';
    this.isRequired = props.isRequired || false;
    this.isInvalid = props.isInvalid || false;
    this.selectLabel = props.Label || '';
    this.selectItems = Array.isArray(props.selectItems) ? props.selectItems : [];
    this.style = props.style
    this.isTimeModalSelected = props.isTimeModalSelected
    this.state = {
      isSelected: false
    }
  }
 
  render() {
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const selectLabelprop = inputArray?.labelText || this.selectLabel;
    const placeholderprop = inputArray?.placeholder || this.placeholder;
    const selectItems = Array.isArray(inputArray?.options) ? inputArray.options : this.selectItems;
    return (
      <FormControl isRequired={this.isRequired} isInvalid={this.isInvalid} style={this.style}>
        <FormControlLabel>
          <FormControlLabelText>{selectLabelprop}</FormControlLabelText>
        </FormControlLabel>
        <TouchableOpacity>
          <Select>
            <SelectTrigger>
              <SelectInput placeholder={placeholderprop} />
              <SelectIcon as={ChevronDownIcon} width={16} height={16} />
            </SelectTrigger>
            <SelectPortal isOpen={this.state.isSelected}>
              <SelectBackdrop />
              <SelectContent>
                {selectItems.map((item, index) => (
                  <SelectItem key={index} label={item.label} value={item.value} onPress={() => this.setState({ isSelected: false }, () => console.log(item.value, "=== > selectedItem"))} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </TouchableOpacity>
        <FormControlError>
          <FormControlErrorText></FormControlErrorText>
        </FormControlError>
      </FormControl>
    );
  }
}
 
 
class cbInput extends React.Component {
 
  constructor(props) {
    super(props);
    this.formId = props.formId;
    this.id = props.id;
    this.labelText = props.labelText || "";
    this.variant = props.variant || "outline";
    this.input = props.input || 'text';
    this.placeholder = props.placeholder || '';
    this.errorMessage = props.errorMessage || '';
    this.isReadOnly = props.isReadOnly || false;
    this.isDisabled = props.isDisabled || false;
    this.isRequired = props.isRequired || false;
    this.isInvalid = props.isInvalid || false;
    this.setFormFieldData = typeof props.setFormFieldData === 'function' ? props.setFormFieldData : () => { };
    this.style = props.style;
    this.multiline = props.multiline
    this.numberOfLines = props.numberOfLines
    this.value = props.value
    this.getFormFieldData = typeof props.getFormFieldData === 'function' ? props.getFormFieldData : () => { }
    this.props = props.labelRequired
    this.isPasswordVisible = props.isPasswordVisible
  }
 
 
  render() {
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const variantprop = inputArray?.variant || this.valueariant;
    const typeprop = inputArray?.type || this.input;
    const labelTextprop = inputArray?.labelText || this.labelText;
    const placeholderprop = inputArray?.placeholder || this.placeholder;
    const errorMessageprop = inputArray?.errorMessage || this.errorMessage;
    const isDisabledprop = inputArray?.isDisabled === 1 || this.isDisabled;
    const isReadOnlyprop = inputArray?.isReadOnly === 1 || this.isReadOnly;
    const isRequiredprop = inputArray?.isRequired === 1 || this.isRequired;
    const value = getFormFieldDataSelector(this.props?.formData, this.props?.formId, this.props?.id);
    return (
      <FormControl
      isDisabled={isDisabledprop}
      isReadOnly={isReadOnlyprop}
      isRequired={isRequiredprop}
    >
      {(this.labelRequired && labelTextprop) && (
        <FormControlLabel>
          <FormControlLabelText>{this?.labelText}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Input variant={variantprop}>
        <InputField
          id={this.id}
          placeholder={placeholderprop}
          placeholderTextColor="#fff"
          type={!this.props?.isPasswordVisible?typeprop:"text"}
          multiline={this.multiline}
          numberOfLines={this.numberOfLines}
          style={[{ textAlignVertical: "top" }, this.style]}
          value={value?.value ? value?.value : this.value}
          onChangeText={(value) => {
            this.props?.setFormFieldData({formId:this.props?.formId, type:'input', id:this.id,controlValue:value,controlId:this.id});
          }}
          onFocus={() => this.props?.setFormFieldData({formId:this.props?.formId, type:'input', id:this.id, value,controlId:this.id})}
        />
      </Input>
      {isRequiredprop && errorMessageprop && (
        <FormControlError>
          <FormControlErrorText>
            {errorMessageprop}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
    );
  }
}

function cbForm({ formId, setFormFieldData, children }) {
 
  const childrenWithProps = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { formId, setFormFieldData })
      : child
  );
 
 
  return <Box style={{width: '90%', }}>{childrenWithProps}</Box>;
}
 
 
class cbVStack extends React.Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.children = this.props;
    this.space = props.space || 'md';
  }
 
  render() {
 
    const { children } = this.props;
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const spaceprop = inputArray?.space || this.space;
 
    return (
      <VStack space={spaceprop}>
        {children}
      </VStack>
    );
  }
}
 
class CbFlatList extends React.Component {
  constructor(props) {
    super();
    this.id = props.id;
    this.children = props.children;
    this.space = props.space || 'md';
    this.flatlistData = props.flatlistData || []
    this.numColumns = props.numColumns || 0
    this.initialNumToRender = props.initialNumToRender || 10
    this.bounces = props.bounces || false
    this.horizontal = props.horizontal
    this.inverted = props.inverted || false
    this.contentContainerStyle = props.contentContainerStyle
    this.ref = props.ref
    this.emptyListText = props.emptyListText || ""
    this.showsHorizontalScrollIndicator = props.showsHorizontalScrollIndicator || false
    this.showsVerticalScrollIndicator = props.showsVerticalScrollIndicator || false
    this.customStyles = props.customStyles || {}
    this.extraData = props.extraData || []
    this.scrollEnabled = props.scrollEnabled
    this.nestedScrollEnabled = props.nestedScrollEnabled
  }
  renderEmptyList = () => {
    return (
      <VStack>
        <Text>{this.emptyListText}</Text>
      </VStack>
    )
  }
  render() {
    const { children } = this.props;
    const inputArray = global.controlsConfigJson.find(item => item.id === this.id);
    const spaceprop = inputArray?.space || this.space;
    const ITEM_HEIGHT = 100
    return (
      <FlatList
        ref={this.ref}
        keyExtractor={this.keyExtractor}
        data={this.flatlistData}
        renderItem={this.children}
        numColumns={this.numColumns}
        ListEmptyComponent={this.renderEmptyList}
        ListFooterComponent={this.ListFooterComponent}
        bounces={this.bounces}
        horizontal={this.horizontal}
        inverted={this.inverted}
        contentContainerStyle={this.contentContainerStyle}
        maxToRenderPerBatch={10}
        showsHorizontalScrollIndicator={this.showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={this.showsVerticalScrollIndicator}
        style={this.customStyles}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        windowSize={21}
        onEndReachedThreshold={0.1}
        extraData={this.extraData}
        scrollEnabled={this.scrollEnabled}
        nestedScrollEnabled={this.nestedScrollEnabled}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return{
    formData: state.login.formData,
  }
};
 
const mapDispatchToProps = {
  setFormFieldData,
  getFormFieldData
};
CbImage.displayName = 'ConnectedCbImage';
cbButton.displayName = 'ConnectedCbButton';
cbInput.displayName = 'ConnectedCbInput';
cbCheckBox.displayName = 'ConnectedCbCheckBox';
cbSelect.displayName = 'ConnectedCbSelect';
cbImageBackground.displayName = 'ConnectedCbImageBackground';
cbRadioButton.displayName = 'ConnectedCbRadioButton';
cbVStack.displayName = 'ConnectedCbVStack';
cbForm.displayName = 'ConnectedCbForm';
CbFlatList.displayName = "ConnectedCbFlatList"
 

const ConnectedCbInput = connect(mapStateToProps, mapDispatchToProps)(cbInput);
const ConnectedCbButton = connect(mapStateToProps, mapDispatchToProps)(cbButton);
const ConnectedCbCheckBox = connect(mapStateToProps, mapDispatchToProps)(cbCheckBox);
const ConnectedCbSelect = connect(mapStateToProps, mapDispatchToProps)(cbSelect);
const ConnectedCbImageBackground = connect(mapStateToProps, mapDispatchToProps)(cbImageBackground);
const ConnectedCbRadioButton = connect(mapStateToProps, mapDispatchToProps)(cbRadioButton);
const ConnectedCbVStack = connect(mapStateToProps, mapDispatchToProps)(cbVStack);
const ConnectedCbForm = connect(mapStateToProps, mapDispatchToProps)(cbForm);
const ConnectedCbFlatList = connect(mapStateToProps, mapDispatchToProps)(CbFlatList);
const ConnectedCbImage = connect(mapStateToProps, mapDispatchToProps)(CbImage);
export { 
  ConnectedCbButton, 
  ConnectedCbInput, 
  ConnectedCbCheckBox, 
  ConnectedCbSelect, 
  ConnectedCbImageBackground, 
  ConnectedCbRadioButton, 
  ConnectedCbVStack, 
  ConnectedCbForm, 
  ConnectedCbFlatList, 
  ConnectedCbImage 
};
 
// export {  cbButton, cbInput, cbCheckBox, cbSelect, cbImageBackground, cbRadioButton, cbVStack, cbForm, CbFlatList, CbImage };