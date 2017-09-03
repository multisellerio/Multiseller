﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using MultiSellerIo.Core.Enum;
using MultiSellerIo.Dal;
using System;

namespace MultiSellerIo.Dal.Migrations
{
    [DbContext(typeof(MultiSellerIoContext))]
    partial class MultiSellerIoContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<long>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<long>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<long>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<long>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<long>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<long>", b =>
                {
                    b.Property<long>("UserId");

                    b.Property<long>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<long>", b =>
                {
                    b.Property<long>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.Category", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<long?>("ParentCategoryId");

                    b.Property<string>("Slug");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("ParentCategoryId");

                    b.ToTable("Categories");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.CategoryAttribute", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CategoryId");

                    b.Property<DateTimeOffset>("Created");

                    b.Property<bool>("IsRequired");

                    b.Property<long>("ProductAttributeId");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("ProductAttributeId");

                    b.ToTable("CategoryAttributes");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.Product", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CategoryId");

                    b.Property<DateTimeOffset>("Created");

                    b.Property<string>("DefaultImage");

                    b.Property<string>("Description");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Slug");

                    b.Property<string>("Title");

                    b.Property<DateTimeOffset>("Updated");

                    b.Property<long>("UserId");

                    b.Property<string>("Vendor");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("UserId");

                    b.ToTable("Products");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductAttribute", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<string>("Description");

                    b.Property<string>("Name");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.ToTable("ProductAttributes");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductAttributeMapping", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<long>("ProductAttributeId");

                    b.Property<long>("ProductId");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("ProductAttributeId");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductAttributeMapping");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductAttributeValue", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<long>("ProductAttributeId");

                    b.Property<DateTimeOffset>("Updated");

                    b.Property<string>("Value");

                    b.HasKey("Id");

                    b.HasIndex("ProductAttributeId");

                    b.ToTable("ProductAttributeValues");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductImage", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<string>("Name");

                    b.Property<long>("ProductId");

                    b.Property<string>("ThumbName");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductImages");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductVariant", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Barcode");

                    b.Property<decimal>("CompareAtPrice");

                    b.Property<DateTimeOffset>("Created");

                    b.Property<string>("DefaultImage");

                    b.Property<decimal>("Price");

                    b.Property<long?>("ProductId");

                    b.Property<decimal>("Quantity");

                    b.Property<string>("Sku");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("ProductId");

                    b.ToTable("ProductVariants");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductVariantSpecificationAttributeMapping", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("Created");

                    b.Property<long>("ProductAttributeValueId");

                    b.Property<long>("ProductVariantId");

                    b.Property<DateTimeOffset>("Updated");

                    b.HasKey("Id");

                    b.HasIndex("ProductAttributeValueId");

                    b.HasIndex("ProductVariantId");

                    b.ToTable("ProductVariantSpecificationAttributeMappings");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.Role", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.User", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName");

                    b.Property<int>("Gender");

                    b.Property<string>("LastName");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<long>", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<long>", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<long>", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<long>", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MultiSellerIo.Dal.Entity.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<long>", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.Category", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Category", "ParentCategory")
                        .WithMany()
                        .HasForeignKey("ParentCategoryId");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.CategoryAttribute", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Category", "Category")
                        .WithMany("CategoryAttributes")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MultiSellerIo.Dal.Entity.ProductAttribute", "ProductAttribute")
                        .WithMany()
                        .HasForeignKey("ProductAttributeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.Product", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Category", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MultiSellerIo.Dal.Entity.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductAttributeMapping", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.ProductAttribute", "ProductAttribute")
                        .WithMany()
                        .HasForeignKey("ProductAttributeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MultiSellerIo.Dal.Entity.Product", "Product")
                        .WithMany("ProductAttributeMappings")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductAttributeValue", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.ProductAttribute", "ProductAttribute")
                        .WithMany("ProductAttributeValues")
                        .HasForeignKey("ProductAttributeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductImage", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Product", "Product")
                        .WithMany("Images")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductVariant", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.Product")
                        .WithMany("ProductVariants")
                        .HasForeignKey("ProductId");
                });

            modelBuilder.Entity("MultiSellerIo.Dal.Entity.ProductVariantSpecificationAttributeMapping", b =>
                {
                    b.HasOne("MultiSellerIo.Dal.Entity.ProductAttributeValue", "ProductAttributeValue")
                        .WithMany()
                        .HasForeignKey("ProductAttributeValueId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("MultiSellerIo.Dal.Entity.ProductVariant", "ProductVariant")
                        .WithMany("ProductVariantSpecificationAttributeMappings")
                        .HasForeignKey("ProductVariantId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
