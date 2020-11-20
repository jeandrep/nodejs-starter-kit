import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import { FormItem, TreeSelect } from '@gqlapp/look-client-react';

import CATEGORY_QUERY from '../graphql/CategoryQuery.graphql';

const CategoryTreeComponentView = props => {
  const { categories, formik, name, client, disableParent = false } = props;
  const [data, setData] = useState([
    {
      id: 'abc',
      pId: 0,
      title: 'Parent Category',
      value: 0,
      isLeaf: true
    },
    ...(categories.edges &&
      categories.totalCount > 0 &&
      categories.edges.map(c => {
        return {
          id: c.node.id,
          pId: c.node.parentCategoryId ? c.node.parentCategoryId : 0,
          title: c.node.title,
          value: c.node.id,
          isLeaf: c.node.isLeaf,
          disabled: disableParent && !c.node.isLeaf
        };
      }))
  ]);
  const onChange = value => {
    const { onChange } = props;
    if (onChange) {
      onChange(value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  const LoadData = async treeNode => {
    const {
      data: { category },
      loading
    } = await client.query({
      query: CATEGORY_QUERY,
      variables: {
        id: treeNode.id
      }
    });
    !loading &&
      setData(
        data.concat(
          category.subCategories.map(sC => {
            return {
              id: sC.id,
              pId: sC.parentCategoryId,
              value: sC.id,
              title: sC.title,
              isLeaf: sC.isLeaf,
              disabled: disableParent && !sC.isLeaf
            };
          })
        )
      );
  };

  console.log(data);
  return (
    <FormItem label={props.label} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
      <TreeSelect
        treeDataSimpleMode
        showSearch
        style={{ width: '100%' }}
        value={props.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll={false}
        onChange={onChange}
        loadData={LoadData}
        treeData={data}
      />
    </FormItem>
  );
};

CategoryTreeComponentView.propTypes = {
  categories: PropTypes.object,
  formik: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number,
  client: PropTypes.object,
  disableParent: PropTypes.bool,
  onChange: PropTypes.func
};

export default withApollo(CategoryTreeComponentView);
