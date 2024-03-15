import _ from 'lodash';

export const UserRole = [
  {
    name: "Principle Investigator",
    value: "PI",
  },
  {
    name: "Site Admin",
    value: "site_admin",
  },
  {
    name: "Site Co-ordinator",
    value: "site_coordinator",
  },
  {
    name: "Site Monitor",
    value: "site_monitor",
  },
];

export const extractFilenameFromKey = (key) => {
  if (key) {
    // Split the key by '/'
    const parts = key.split("/");
    // Get the last part (filename)
    const filename = parts[parts.length - 1];
    return filename;
  }
  return;
};
export const getSeriesColor = (index) => {
    const colorArr = ["#2E63DF", "#00928F", "#F765A3", "#A155B9", "#FF897D", "#F2994A", "#219653", "#2289C2", "#6C1CED", "#64CC26", "#EC7E2D"];
    if(index > colorArr.length-1) {
        const clr = colorArr[(index-1) % (colorArr.length-1)];
        return clr;
    }
    return colorArr[index];
}

export const mergeCustomFields = (subjectEnrollConfiguration, customFields) => {
    const _tempConfiguration = JSON.parse(JSON.stringify(subjectEnrollConfiguration));
    _.each(customFields, (customField) => {
        const stepKey = customField.stepKey;
        const sectionKey = customField.sectionKey;
        const subSectionKey = customField.subSectionKey;
        const categoryKey = customField.categoryKey;

        const stepData = _.filter(_tempConfiguration?.steps, (step) => {
            return step.key == stepKey;
        })
        const sectionData = _.filter(stepData[0]?.sections, (section) => {
            return section.key == sectionKey;
        });
        let categoryData = [];
        if (subSectionKey) {
            const subSectionData = _.filter(sectionData[0]?.subTabs, (subSection) => {
                return subSection.key == subSectionKey;
            });
            categoryData = _.filter(subSectionData[0]?.categories, (category) => {
                return category.key == categoryKey;
            });
        } else {
            categoryData = _.filter(sectionData[0]?.categories, (category) => {
                return category.key == categoryKey;
            });
        }

        
        if (categoryData[0]) {
            let categoryObject = categoryData[0];
            categoryObject.fields = categoryObject.fields?.concat(customField?.customFields);
        }
    })
    return _tempConfiguration;
}
