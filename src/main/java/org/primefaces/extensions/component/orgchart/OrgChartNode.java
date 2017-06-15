package org.primefaces.extensions.component.orgchart;

import java.util.List;

public interface OrgChartNode {
    
    public String getId();
    
    public void setId(String id);

    String getName();

    void setName(String name);

    String getTitle();

    void setTitle(String title);

    List<OrgChartNode> getChildren();

    void setChildren(List<OrgChartNode> children);

    OrgChartNode getParent();

    void setParent(OrgChartNode parent);

    public void addChild(OrgChartNode child);

    public void clearChildren();

    public void clearParent();
    
    public String getClassName();
    
    public void setClassName(String className);
}
